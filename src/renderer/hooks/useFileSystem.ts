import { useState, useEffect } from "react";

export function useFileSystem() {
  const [currentFolder, setCurrentFolder] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("folder");
  });
  const [textFiles, setTextFiles] = useState<string[]>([]);

  // Load files when folder changes
  useEffect(() => {
    if (currentFolder) {
      window.electronAPI.listTextFiles(currentFolder).then(setTextFiles);
    }
  }, [currentFolder]);

  // Handle new file creation
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuNewFile(async () => {
      if (currentFolder) {
        const newFile = await window.electronAPI.createNewFile(currentFolder);
        if (newFile) {
          const files = await window.electronAPI.listTextFiles(currentFolder);
          setTextFiles(files);
        }
      }
    });

    return cleanup;
  }, [currentFolder]);

  // Handle folder opening
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuOpenFolder(async () => {
      const path = await window.electronAPI.openFolder();
      if (path) {
        setCurrentFolder(path);
      }
    });

    return cleanup;
  }, []);

  return { currentFolder, textFiles };
}
