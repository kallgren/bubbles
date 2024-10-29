import React from "react";
import Sidebar from "./components/Sidebar";
import { useFileSystem } from "./hooks/useFileSystem";
import { useSidebar } from "./hooks/useSidebar";

function App() {
  const { currentFolder, textFiles } = useFileSystem();
  const { showSidebar, sidebarWidth, setSidebarWidth } = useSidebar();

  return (
    <div className="flex h-screen">
      {showSidebar && (
        <Sidebar
          width={sidebarWidth}
          setWidth={setSidebarWidth}
          currentFolder={currentFolder}
          files={textFiles}
        />
      )}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Bubbles!
        </h1>
      </div>
    </div>
  );
}

export default App;
