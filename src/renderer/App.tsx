import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";

declare global {
  interface Window {
    electronAPI: {
      onToggleSidebar: (callback: () => void) => () => void;
      onMenuOpenFolder: (callback: () => void) => () => void;
      openFolder: () => Promise<string | undefined>;
      listTextFiles: (folderPath: string) => Promise<string[]>;
      onMenuNewFile: (callback: () => void) => () => void;
      createNewFile: (folderPath: string) => Promise<string | null>;
    };
  }
}

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [currentFolder, setCurrentFolder] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("folder");
  });
  const [textFiles, setTextFiles] = useState<string[]>([]);

  // Effect to load files when folder changes
  useEffect(() => {
    if (currentFolder) {
      window.electronAPI.listTextFiles(currentFolder).then(setTextFiles);
    }
  }, [currentFolder]);

  // Handlers that don't depend on any state
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

  // Handler that needs currentFolder
  useEffect(() => {
    const cleanupNewFile = window.electronAPI.onMenuNewFile(async () => {
      if (currentFolder) {
        const newFile = await window.electronAPI.createNewFile(currentFolder);
        if (newFile) {
          const files = await window.electronAPI.listTextFiles(currentFolder);
          setTextFiles(files);
        }
      }
    });

    return () => {
      cleanupNewFile();
    };
  }, [currentFolder]);

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
