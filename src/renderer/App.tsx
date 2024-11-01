import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import WelcomeScreen from "./components/WelcomeScreen";
import { useFiles } from "./hooks/useFiles";
import { useSidebar } from "./hooks/useSidebar";
import TitleBar from "./components/TitleBar";
import { SettingsModal } from "./components/SettingsModal";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const cleanup = window.electronAPI.onMenuOpenSettings(() => {
      setIsSettingsOpen(true);
    });
    return cleanup;
  }, []);

  const {
    currentFolder,
    activeFiles,
    archivedFiles,
    currentFile,
    fileContent,
    openFile,
  } = useFiles();

  const { showSidebar, sidebarWidth, setSidebarWidth } = useSidebar();

  return (
    <div className="flex h-screen text-text dark:text-dark-text">
      {showSidebar && (
        <Sidebar
          width={sidebarWidth}
          setWidth={setSidebarWidth}
          currentFolder={currentFolder}
          activeFiles={activeFiles}
          archivedFiles={archivedFiles}
          currentFile={currentFile}
          onFileSelect={(filename) =>
            currentFolder && filename && openFile(currentFolder, filename)
          }
        />
      )}
      <div
        className={`flex flex-col flex-1 ${
          currentFile
            ? "bg-primary dark:bg-dark-tertiary"
            : "bg-secondary dark:bg-dark-secondary"
        }`}
      >
        <TitleBar title={currentFile || ""} />
        <div className="flex-1">
          {currentFile ? (
            <Editor filename={currentFile} content={fileContent} />
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
