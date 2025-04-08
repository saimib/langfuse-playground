import { useState } from "react";
import "./App.css";
import ConfigPanel from "./components/ConfigPanel";
import DocumentationOverlay from "./components/DocumentationOverlay";
import Header from "./components/Header";
import PromptPanel from "./components/PromptPanel";
import { useConfig } from "./hooks/useConfig";
import { useMessages } from "./hooks/useMessages";
import { usePrompt } from "./hooks/usePrompt";

function App() {
  const [showDocumentation, setShowDocumentation] = useState(false);

  const {
    promptState,
    resetPrompt,
    toggleFormat,
    addHumanMessage,
    addAIMessage,
    addToolMessage,
  } = usePrompt();

  const {
    configState,
    updateModel,
    updateProvider,
    updateApiKey,
    updateTemperature,
    updateMetadata,
  } = useConfig();

  const { currentInput, isLoading } = useMessages(
    addHumanMessage,
    addAIMessage,
    addToolMessage
  );

  const handleDocumentationClick = () => {
    setShowDocumentation(!showDocumentation);
  };

  return (
    <div className="app">
      <Header onDocumentationClick={handleDocumentationClick} />
      <div className="app-content">
        <div className="main-panels">
          <PromptPanel
            promptState={promptState}
            resetPrompt={resetPrompt}
            toggleFormat={toggleFormat}
            currentInput={currentInput}
            configState={configState}
            updateMetadata={updateMetadata}
          />
          <ConfigPanel
            configState={configState}
            updateModel={updateModel}
            updateProvider={updateProvider}
            updateApiKey={updateApiKey}
            updateTemperature={updateTemperature}
          />
        </div>
      </div>
      <DocumentationOverlay
        showDocumentation={showDocumentation}
        onClose={handleDocumentationClick}
      />
    </div>
  );
}

export default App;
