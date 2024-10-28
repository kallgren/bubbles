import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";

declare global {
  interface Window {
    electronAPI: {
      onToggleSidebar: (callback: () => void) => () => void;
    };
  }
}

function App() {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const cleanup = window.electronAPI.onToggleSidebar(() => {
      setShowSidebar((prev) => !prev);
    });

    return cleanup;
  }, []);

  return (
    <div className="flex h-screen">
      {showSidebar && <Sidebar />}
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Bubbles!
        </h1>
      </div>
    </div>
  );
}

export default App;
