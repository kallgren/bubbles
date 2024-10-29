import { useState, useEffect } from "react";

export function useFiles() {
  // File system state
  const [currentFolder, setCurrentFolder] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("folder");
  });
  const [textFiles, setTextFiles] = useState<string[]>([]);

  // Current file state
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

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
        closeFile();
      }
    });

    return cleanup;
  }, []);

  const openFile = async (folderPath: string, filename: string) => {
    const content = await window.electronAPI.readFile(folderPath, filename);
    setCurrentFile(filename);
    setFileContent(content);
  };

  const closeFile = () => {
    setCurrentFile(null);
    setFileContent(null);
  };

  // Handle file deletion
  useEffect(() => {
    const cleanup = window.electronAPI.onMenuDeleteFile(async () => {
      if (currentFolder && currentFile) {
        const success = await window.electronAPI.deleteFile(
          currentFolder,
          currentFile
        );
        if (success) {
          closeFile();
          const files = await window.electronAPI.listTextFiles(currentFolder);
          setTextFiles(files);
        }
      }
    });
    return cleanup;
  }, [currentFolder, currentFile]);

  return {
    // File system
    currentFolder,
    textFiles,
    // Current file
    currentFile,
    fileContent,
    // Actions
    openFile,
    closeFile,
  };
}
