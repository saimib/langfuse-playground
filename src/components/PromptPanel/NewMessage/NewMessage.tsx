import React, { useState } from "react";
import "./NewMessage.css";

interface NewMessageProps {
  onChange: (newMessage: string, role: string) => void;
  role?: string;
  onRoleChange?: (role: string) => void;
}

const NewMessage: React.FC<NewMessageProps> = ({
  onChange,
  role = "user",
  onRoleChange,
}) => {
  // Local state for role if no onRoleChange is provided
  const [localRole, setLocalRole] = useState(role);
  const [newMessage, setNewMessage] = useState("");

  // Use either the controlled role or the local role
  const currentRole = onRoleChange ? role : localRole;

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRole = e.target.value;
    if (onRoleChange) {
      onRoleChange(newRole);
    } else {
      setLocalRole(newRole);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  const onAddMessage = () => {
    onChange(newMessage, currentRole);
    setNewMessage("");
  };

  return (
    <div className="new-message">
      <div className="new-message-header">
        <h3 className="section-title">New Message</h3>
        <div className="role-input-container">
          <label htmlFor="role-input">Role:</label>
          <input
            id="role-input"
            className="role-input"
            type="text"
            value={currentRole}
            onChange={handleRoleChange}
            placeholder="user"
          />
        </div>
      </div>
      <div className="message-input-container">
        <textarea
          className="message-input"
          value={newMessage}
          onChange={handleChange}
          placeholder="Type here..."
        />
        <button
          className="send-button"
          onClick={onAddMessage}
          disabled={newMessage.trim().length === 0}
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
          Add Message
        </button>
      </div>
    </div>
  );
};

export default NewMessage;
