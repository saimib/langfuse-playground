import React, { useEffect, useState } from "react";
import "./JsonEditor.css";

interface JsonEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  initialValue = "",
  onChange,
  placeholder = "Enter JSON here...",
}) => {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Function to validate if the JSON follows OpenAI's message schema
  const validateOpenAISchema = (
    json: any
  ): { valid: boolean; message: string } => {
    // Check if it's an array
    if (!Array.isArray(json)) {
      return {
        valid: false,
        message: "JSON must be an array of message objects",
      };
    }

    // Check each message object
    for (let i = 0; i < json.length; i++) {
      const msg = json[i];

      // Check if it's an object
      if (typeof msg !== "object" || msg === null) {
        return {
          valid: false,
          message: `Message at index ${i} must be an object`,
        };
      }

      // Check if it has a role property
      if (!msg.role) {
        return {
          valid: false,
          message: `Message at index ${i} is missing 'role' property`,
        };
      }

      // Check if role is valid
      const validRoles = [
        "system",
        "user",
        "assistant",
        "function",
        "tool",
        "human",
        "ai",
      ];
      if (!validRoles.includes(msg.role)) {
        return {
          valid: false,
          message: `Message at index ${i} has invalid role '${
            msg.role
          }'. Valid roles are: ${validRoles.join(", ")}`,
        };
      }

      // Check if it has a content property (unless it's a function or tool message)
      if (
        msg.role !== "function" &&
        msg.role !== "tool" &&
        !msg.content &&
        msg.content !== ""
      ) {
        return {
          valid: false,
          message: `Message at index ${i} is missing 'content' property`,
        };
      }

      // Check if content is a string (when present)
      if (msg.content !== undefined && typeof msg.content !== "string") {
        return {
          valid: false,
          message: `Message at index ${i} has 'content' that is not a string`,
        };
      }

      // Check for invalid fields in the message object
      if (msg.additional_kwargs) {
        return {
          valid: false,
          message: `Message at index ${i} contains 'additional_kwargs' which is not valid in OpenAI's API schema. This field should be removed.`,
        };
      }

      // Additional checks for function and tool messages
      if (msg.role === "function" && !msg.name) {
        return {
          valid: false,
          message: `Function message at index ${i} is missing 'name' property`,
        };
      }

      if (msg.role === "tool" && !msg.tool_call_id) {
        return {
          valid: false,
          message: `Tool message at index ${i} is missing 'tool_call_id' property`,
        };
      }

      // Check for tool_calls in assistant messages
      if (msg.role === "assistant" && msg.tool_calls) {
        // Validate each tool call
        for (let j = 0; j < msg.tool_calls.length; j++) {
          const toolCall = msg.tool_calls[j];

          // Check if it has required properties
          if (!toolCall.id || !toolCall.type || !toolCall.function) {
            return {
              valid: false,
              message: `Tool call at index ${j} in message ${i} is missing required properties (id, type, function)`,
            };
          }

          // Check if function has name and arguments
          if (!toolCall.function.name) {
            return {
              valid: false,
              message: `Function in tool call at index ${j} in message ${i} is missing 'name' property`,
            };
          }

          // Check if arguments is a string (not an object)
          if (
            toolCall.function.arguments &&
            typeof toolCall.function.arguments !== "string"
          ) {
            return {
              valid: false,
              message: `Function arguments in tool call at index ${j} in message ${i} must be a JSON string, not an object. Convert it using JSON.stringify().`,
            };
          }
        }
      }
    }

    return { valid: true, message: "" };
  };

  // Function to fix common issues in the JSON
  const fixJsonSchema = () => {
    try {
      if (!value.trim()) return;

      const parsedJson = JSON.parse(value);
      let modified = false;

      // Only process if it's an array
      if (Array.isArray(parsedJson)) {
        // First pass: collect tool call IDs from assistant messages
        const toolCallIds: string[] = [];
        const toolCallNames: string[] = [];

        for (let i = 0; i < parsedJson.length; i++) {
          const msg = parsedJson[i];

          // Collect tool call IDs from assistant messages
          if (
            msg.role === "assistant" &&
            msg.tool_calls &&
            Array.isArray(msg.tool_calls)
          ) {
            for (const toolCall of msg.tool_calls) {
              if (toolCall.id) {
                toolCallIds.push(toolCall.id);
                toolCallNames.push(toolCall.function?.name || "");
              }
            }
          }

          // Also check in additional_kwargs if present
          if (
            msg.additional_kwargs?.tool_calls &&
            Array.isArray(msg.additional_kwargs.tool_calls)
          ) {
            for (const toolCall of msg.additional_kwargs.tool_calls) {
              if (toolCall.id) {
                toolCallIds.push(toolCall.id);
                toolCallNames.push(toolCall.function?.name || "");
              }
            }
          }
        }

        // Second pass: fix issues
        let toolMessageIndex = 0;

        for (let i = 0; i < parsedJson.length; i++) {
          const msg = parsedJson[i];

          // Remove additional_kwargs
          if (msg.additional_kwargs) {
            // If there are tool_calls in additional_kwargs, move them to the top level
            if (
              msg.additional_kwargs.tool_calls &&
              Array.isArray(msg.additional_kwargs.tool_calls)
            ) {
              msg.tool_calls = msg.additional_kwargs.tool_calls;

              // Convert function arguments to strings
              for (const toolCall of msg.tool_calls) {
                if (
                  toolCall.function &&
                  toolCall.function.arguments &&
                  typeof toolCall.function.arguments !== "string"
                ) {
                  toolCall.function.arguments = JSON.stringify(
                    toolCall.function.arguments
                  );
                }
              }
            }

            // Delete the additional_kwargs property
            delete msg.additional_kwargs;
            modified = true;
          }

          // Convert function arguments to strings in any tool_calls
          if (msg.tool_calls && Array.isArray(msg.tool_calls)) {
            for (const toolCall of msg.tool_calls) {
              if (
                toolCall.function &&
                toolCall.function.arguments &&
                typeof toolCall.function.arguments !== "string"
              ) {
                toolCall.function.arguments = JSON.stringify(
                  toolCall.function.arguments
                );
                modified = true;
              }
            }
          }

          // Fix tool messages missing tool_call_id
          if (msg.role === "tool" && !msg.tool_call_id) {
            // If we have collected tool call IDs and there's one available for this tool message
            if (toolCallIds.length > toolMessageIndex) {
              msg.tool_call_id = toolCallIds[toolMessageIndex];

              // Add a comment to the content if it's empty
              if (!msg.content) {
                const toolName = toolCallNames[toolMessageIndex] || "unknown";
                msg.content = `Response from ${toolName} tool`;
              }

              toolMessageIndex++;
              modified = true;
            }
          }
        }
      }

      // If modifications were made, update the value
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      if (modified) {
        setValue(formattedJson);
        onChange(formattedJson);
      }
      handleChange(formattedJson);
    } catch (error) {
      // If JSON is invalid, don't attempt to fix
      console.error("Cannot fix invalid JSON:", error);
    }
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);

    try {
      if (newValue.trim()) {
        const parsedJson = JSON.parse(newValue);

        // First check if it's valid JSON
        setIsValid(true);

        // Then check if it follows OpenAI's schema
        const schemaValidation = validateOpenAISchema(parsedJson);
        if (!schemaValidation.valid) {
          setIsValid(false);
          setErrorMessage(`Schema Error: ${schemaValidation.message}`);
        } else {
          setErrorMessage("");
        }
      } else {
        setIsValid(true);
        setErrorMessage("");
      }
    } catch (error) {
      setIsValid(false);
      setErrorMessage(`JSON Parse Error: ${(error as Error).message}`);
    }

    onChange(newValue);
  };

  const formatJson = () => {
    try {
      if (value.trim()) {
        const parsedJson = JSON.parse(value);
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        setValue(formattedJson);
        onChange(formattedJson);
      }
    } catch (error) {
      // If JSON is invalid, don't format
    }
  };

  return (
    <div className="json-editor-container">
      <div className="json-editor-header">
        <h3>JSON Editor</h3>
        <div className="json-editor-controls">
          <span className={`schema-status ${isValid ? "valid" : "invalid"}`}>
            {isValid ? "✓ Valid Schema" : "✗ Invalid Schema"}
          </span>
          <button
            className="fix-button"
            onClick={fixJsonSchema}
            disabled={!value.trim()}
            title="Fix common schema issues (remove additional_kwargs, convert object arguments to strings)"
          >
            Fix Schema
          </button>
          <button
            className="format-button"
            onClick={formatJson}
            disabled={!value.trim()}
          >
            Format JSON
          </button>
        </div>
      </div>
      <textarea
        className={`json-editor-textarea ${!isValid ? "invalid" : ""}`}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
      />
      {!isValid && <div className="json-editor-error">{errorMessage}</div>}

      <div className="json-editor-help">
        <h4>Expected Schema Format</h4>
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
        <div className="json-editor-notes">
          <p>
            <strong>Important Notes:</strong>
          </p>
          <ul>
            <li>
              The <code>additional_kwargs</code> field is not valid in OpenAI's
              API schema and should be removed.
            </li>
            <li>
              Function <code>arguments</code> must be a JSON string, not an
              object. Use <code>JSON.stringify()</code> to convert.
            </li>
            <li>
              Tool messages require a <code>tool_call_id</code> that matches the{" "}
              <code>id</code> from a tool call in a previous assistant message.
            </li>
            <li>
              Use the "Fix Schema" button to automatically fix these common
              issues:
            </li>
            <ul>
              <li>
                Remove <code>additional_kwargs</code> and move tool calls to the
                top level
              </li>
              <li>Convert function arguments from objects to JSON strings</li>
              <li>
                Add missing <code>tool_call_id</code> to tool messages by
                matching with previous tool call IDs
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JsonEditor;
