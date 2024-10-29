import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { useFileSystem } from "./hooks/useFileSystem";
import { useSidebar } from "./hooks/useSidebar";
import { useCurrentFile } from "./hooks/useCurrentFile";

function App() {
  const { currentFolder, textFiles } = useFileSystem();
  const { currentFile, fileContent, openFile } = useCurrentFile();
  const { showSidebar, sidebarWidth, setSidebarWidth } = useSidebar();

  return (
    <div className="flex h-screen">
      {showSidebar && (
        <Sidebar
          width={sidebarWidth}
          setWidth={setSidebarWidth}
          currentFolder={currentFolder}
          files={textFiles}
          onFileSelect={(filename) =>
            currentFolder && filename && openFile(currentFolder, filename)
          }
        />
      )}
      <div className="flex-1 bg-gray-50">
        {currentFile ? (
          <Editor filename={currentFile} content={fileContent} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to Bubbles!
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
