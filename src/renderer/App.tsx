import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";

declare global {
  interface Window {
    electronAPI: {
      onToggleSidebar: (callback: () => void) => () => void;
      onMenuOpenFolder: (callback: () => void) => () => void;
      openFolder: () => Promise<string | undefined>;
      listTextFiles: (folderPath: string) => Promise<string[]>;
    };
  }
}

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(256); // 256px = 16rem (w-64)
  const [currentFolder, setCurrentFolder] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("folder");
  });

  useEffect(() => {
    const cleanupSidebar = window.electronAPI.onToggleSidebar(() => {
      setShowSidebar((prev) => !prev);
    });

    const cleanupOpenFolder = window.electronAPI.onMenuOpenFolder(async () => {
      const path = await window.electronAPI.openFolder();
      if (path) {
        setCurrentFolder(path);
      }
    });

    return () => {
      cleanupSidebar();
      cleanupOpenFolder();
    };
  }, []);

  return (
    <div className="flex h-screen">
      {showSidebar && (
        <Sidebar
          width={sidebarWidth}
          setWidth={setSidebarWidth}
          currentFolder={currentFolder}
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
