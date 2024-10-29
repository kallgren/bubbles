import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { useFiles } from "./hooks/useFiles";
import { useSidebar } from "./hooks/useSidebar";
import TitleBar from "./components/TitleBar";

function App() {
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
        <div className="flex-1 ">
          {currentFile ? (
            <Editor filename={currentFile} content={fileContent} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-4xl font-bold text-text dark:text-dark-text">
                Welcome to Bubbles!
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
