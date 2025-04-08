import React from "react";
import { Message } from "../../../types";
import NewMessage from "../NewMessage";
import "./FormattedView.css";

interface FormattedViewProps {
  jsonValue: { role: string; content: string }[];
  updateMessage: (index: number, content: string) => void;
  deleteMessage: (index: number) => void;
  currentInput: string;
  isLoading: boolean;
  handleNewMessage: (newMessage: string, role: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

const FormattedView: React.FC<FormattedViewProps> = ({
  jsonValue,
  updateMessage,
  deleteMessage,
  currentInput,
  isLoading,
  handleNewMessage,
  handleSendMessage,
  handleKeyDown,
}) => {
  // State to control the visibility of the NewMessage component
  const [showNewMessage, setShowNewMessage] = React.useState(false);

  // State to track the role for the new message
  const [newMessageRole, setNewMessageRole] = React.useState("user");

  // Toggle the visibility of the NewMessage component
  const toggleNewMessage = () => {
    setShowNewMessage(!showNewMessage);
  };

  // Handle role change for the new message
  const handleRoleChange = (role: string) => {
    setNewMessageRole(role);
  };
  // Parse the JSON value directly
  let parsedMessages: Message[] = [];

  try {
    // Convert all messages to the application's format
    parsedMessages = jsonValue.map((msg: any) => {
      return {
        role: msg.role,
        content: msg.content || "",
        timestamp: new Date(),
        ...(msg.toolCallId && { toolCallId: msg.toolCallId }),
        ...(msg.tool_calls && { toolCalls: msg.tool_calls }),
      };
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    // Use default empty values if parsing fails
  }

  // No special handling for system messages

  // Component for editable messages
  const EditableMessage: React.FC<{
    message: Message;
    index: number;
    onUpdate: (index: number, content: string) => void;
    onDelete: (index: number) => void;
  }> = ({ message, index, onUpdate, onDelete }) => {
    // Create a ref for the textarea
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Track if we're currently editing to prevent focus loss
    const [isEditing, setIsEditing] = React.useState(false);

    // Use local state to track content during editing
    const [localContent, setLocalContent] = React.useState(
      message.content || JSON.stringify(message.toolCalls) || ""
    );

    // Update local content when message content changes from parent
    React.useEffect(() => {
      if (!isEditing) {
        setLocalContent(
          message.content || JSON.stringify(message.toolCalls) || ""
        );
      }
    }, [message.content, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Update local state immediately for responsive typing
      setLocalContent(e.target.value);

      // Set editing flag to prevent content override
      setIsEditing(true);

      // Debounce the actual update to parent
      // This reduces re-renders while typing
      // const timeoutId = setTimeout(() => {
      //   console.log("Updating message at index:", index, e.target.value);
      //   onUpdate(index, e.target.value);
      // }, 300);

      // return () => clearTimeout(timeoutId);
    };

    const handleFocus = () => {
      setIsEditing(true);
    };

    const handleBlur = () => {
      // When blurring, ensure parent state is updated with final value
      onUpdate(index, localContent);
      setIsEditing(false);
    };

    // Format role name for display
    const roleLabel =
      message.role.charAt(0).toUpperCase() + message.role.slice(1);

    return (
      <div className="editable-message" data-role={message.role}>
        <div className="message-header">
          <div className="message-role-label">{roleLabel}</div>
          <button
            className="delete-message-button"
            onClick={() => onDelete(index)}
            title="Delete message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="edit-textarea"
          placeholder={`${message.role} message...`}
        />
      </div>
    );
  };

  // Removed renderMessageContent function as we're using direct textarea editing

  // Render messages in their original order
  const renderMessageComponent = (message: Message, index: number) => {
    return (
      <div key={index} className="message-container">
        <EditableMessage
          message={message}
          index={index}
          onUpdate={updateMessage}
          onDelete={deleteMessage}
        />
      </div>
    );
  };

  return (
    <div className="formatted-view">
      {parsedMessages.map(renderMessageComponent)}

      {showNewMessage ? (
        <NewMessage
          onChange={handleNewMessage}
          role={newMessageRole}
          onRoleChange={handleRoleChange}
        />
      ) : (
        <button className="add-message-button" onClick={toggleNewMessage}>
          + Add message
        </button>
      )}
    </div>
  );
};

export default FormattedView;
