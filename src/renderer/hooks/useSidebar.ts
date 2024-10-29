import { useState, useEffect } from "react";

export function useSidebar() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(256);

  useEffect(() => {
    const cleanup = window.electronAPI.onToggleSidebar(() => {
      setShowSidebar((prev) => !prev);
    });

    return cleanup;
  }, []);

  return { showSidebar, sidebarWidth, setSidebarWidth };
}
