import { useState } from "react";

export function useCurrentFile() {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const openFile = async (folderPath: string, filename: string) => {
    const content = await window.electronAPI.readFile(folderPath, filename);
    setCurrentFile(filename);
    setFileContent(content);
    return content;
  };

  const closeFile = () => {
    setCurrentFile(null);
    setFileContent(null);
  };

  return {
    currentFile,
    fileContent,
    openFile,
    closeFile,
  };
}
