import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources";
import React, { useState } from "react";
import { ConfigState, MetadataInfo, PromptState } from "../../types";
import JsonEditor from "../JsonEditor";
import ActionButtons from "./ActionButtons";
import FormatToggle from "./FormatToggle";
import FormattedView from "./FormattedView";
import "./PromptPanel.css";

interface PromptPanelProps {
  promptState: PromptState;
  resetPrompt: () => void;
  toggleFormat: () => void;
  currentInput: string;
  configState: ConfigState;
  updateMetadata: (metadata: Partial<MetadataInfo>) => void;
}

const PromptPanel: React.FC<PromptPanelProps> = ({
  promptState,
  resetPrompt,
  toggleFormat,
  currentInput,
  configState,
  updateMetadata,
}) => {
  const [jsonValue, setJsonValue] = useState<
    { role: string; content: string }[]
  >([]);

  const onResetPrompt = () => {
    setJsonValue([]);
  };

  // Function to parse JSON and update promptState
  const handleJsonChange = (value: string) => {
    try {
      const parsedJson = JSON.parse(value);
      // Update the jsonValue state with the parsed JSON
      setJsonValue(parsedJson);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  // Function to update any message content
  const handleUpdateMessage = (index: number, content: string) => {
    try {
      console.log("Updating message at index:", index);
      console.log("New content:", content);

      // Directly update the message at the specified index
      if (index >= 0 && index < jsonValue.length) {
        // Create a copy of the messages array
        const updatedMessages = [...jsonValue];

        // Update the message at the specified index
        updatedMessages[index] = { ...updatedMessages[index], content };

        // Update the jsonValue
        setJsonValue(updatedMessages);

        console.log("Updated messages:", updatedMessages);
      } else {
        console.error("Invalid index:", index);
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleInputChange = (newMessage: string, role: string) => {
    setJsonValue([...jsonValue, { role, content: newMessage }]);
  };

  // State to track loading state
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle sending messages
  const onSendClick = async () => {
    try {
      setIsLoading(true);
      console.log(
        "Sending message with configuration:",
        configState.modelConfig
      );
      console.log("Messages to send:", jsonValue);

      // Create OpenAI client
      const openai = new OpenAI({
        apiKey: configState.modelConfig.apiKey,
        baseURL: configState.modelConfig.provider || undefined,
        dangerouslyAllowBrowser: true,
      });

      const startTime = performance.now();
      // Send request to OpenAI API
      const response = await openai.chat.completions.create({
        model: configState.modelConfig.model || "gpt-3.5-turbo",
        messages: jsonValue as ChatCompletionMessageParam[],
        temperature: configState.modelConfig.temperature,
      });

      // Log response details
      console.log("Response:", response);

      // Extract token usage and execution time
      const inputTokens = response.usage?.prompt_tokens || 0;
      const outputTokens = response.usage?.completion_tokens || 0;
      const totalTokens = response.usage?.total_tokens || 0;
      const executionTime = performance.now() - startTime;

      console.log("Input Tokens:", inputTokens);
      console.log("Output Tokens:", outputTokens);
      console.log("Total Tokens:", totalTokens);
      console.log("Execution Time (ms):", executionTime);

      // Calculate cost (example calculation, adjust based on model pricing)
      const costPer1kTokens = 0.002; // Example cost per 1k tokens for gpt-3.5-turbo
      const cost = (totalTokens / 1000) * costPer1kTokens;

      console.log("Estimated Cost (USD):", cost);

      updateMetadata({
        executionTime: `${executionTime.toFixed(2)} ms`,
        tokenUsage: {
          input: inputTokens,
          output: outputTokens,
        },
        cost: `$${cost.toFixed(4)}`,
      });

      // Extract the response content
      const assistantMessage = response.choices[0]?.message?.content;

      if (assistantMessage) {
        // Add the response to the messages
        setJsonValue([
          ...jsonValue,
          { role: "assistant", content: assistantMessage },
        ]);
      } else {
        console.error("No response content received from OpenAI");
      }
    } catch (error) {
      console.error("Error sending message to OpenAI:", error);
      // Add an error message to the conversation
      setJsonValue([
        ...jsonValue,
        {
          role: "assistant",
          content:
            "" + error || "An error occurred while processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prompt-panel">
      <div className="prompt-panel-header">
        <ActionButtons onReset={onResetPrompt} />
        <div className="header-right-controls">
          <button
            className="send-button-header"
            onClick={onSendClick}
            disabled={isLoading}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 2L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2l-7 20-4-9-9-4 20-7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isLoading ? "Sending..." : "Send"}
          </button>
          <FormatToggle format={promptState.format} onToggle={toggleFormat} />
        </div>
      </div>
      <div className="prompt-panel-content">
        {promptState.format === "formatted" ? (
          <FormattedView
            jsonValue={jsonValue}
            updateMessage={handleUpdateMessage}
            deleteMessage={(index) => {
              const updatedMessages = jsonValue.filter((_, i) => i !== index);
              setJsonValue(updatedMessages);
            }}
            currentInput={currentInput}
            isLoading={isLoading}
            handleNewMessage={handleInputChange}
            handleSendMessage={onSendClick}
            handleKeyDown={() => {}}
          />
        ) : (
          <div className="json-editor-container">
            <JsonEditor
              initialValue={JSON.stringify(jsonValue, null, 4)}
              onChange={handleJsonChange}
              placeholder="Enter your JSON data here..."
            />
            <div className="json-editor-info">
              <p>Sample JSON format:</p>
              <pre>{`[
  {
    "role": "system" | "user" | "assistant" | "human" | "ai",
    "content": "message content"
  },
  // For function messages:
  {
    "role": "function",
    "name": "function_name",
    "content": "function response"
  },
  // For tool messages:
  {
    "role": "tool",
    "tool_call_id": "tool_call_id",
    "content": "tool response"
  },
  // For assistant messages with tool calls:
  {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "id": "call_abc123",
        "type": "function",
        "function": {
          "name": "function_name",
          "arguments": "{\"param1\":\"value1\",\"param2\":\"value2\"}"  // Must be a JSON string!
        }
      }
    ]
  }
]`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptPanel;
