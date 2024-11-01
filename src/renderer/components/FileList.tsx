import React, { useState, useRef, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";

interface FileListProps {
  activeFiles: string[];
  archivedFiles: string[];
  currentFile: string | null;
  onFileSelect: (filePath: string) => void;
}

const FileList: React.FC<FileListProps> = ({
  activeFiles,
  archivedFiles,
  currentFile,
  onFileSelect,
}) => {
  const { settings } = useSettings();
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const lastSelectedIndex = useRef<number | null>(null);

  // Reset selected files when files change
  useEffect(() => {
    setSelectedFiles(new Set());
    lastSelectedIndex.current = null;
    console.log("lastSelectedIndex reset");
  }, [activeFiles, archivedFiles]);

  const files = [...activeFiles, ...archivedFiles];

  const handleItemClick = (index: number, event: React.MouseEvent) => {
    console.log("lastSelectedIndex", lastSelectedIndex.current);
    const files = [...activeFiles, ...archivedFiles];
    const file = files[index];

    // Handle file selection
    if (event.metaKey || event.ctrlKey) {
      const newSelection = new Set(selectedFiles);
      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }
      setSelectedFiles(newSelection);
    } else if (event.shiftKey && lastSelectedIndex.current !== null) {
      // Shift for range selection
      const start = Math.min(lastSelectedIndex.current, index);
      const end = Math.max(lastSelectedIndex.current, index);
      const newSelection = new Set(selectedFiles);
      for (let i = start; i <= end; i++) {
        newSelection.add(i);
      }
      setSelectedFiles(newSelection);
    } else {
      setSelectedFiles(new Set([index]));
      // Only trigger file open on single click
      onFileSelect(file);
    }
    lastSelectedIndex.current = index;
    console.log("lastSelectedIndex", lastSelectedIndex.current);
  };

  const getItemClassName = (file: string, index: number) => {
    const isSelected = selectedFiles.has(index);
    const isCurrent = file === currentFile;

    return `p-5 border border-black rounded-2xl cursor-default ${
      isSelected
        ? "bg-primary-hover dark:bg-dark-primary-hover"
        : isCurrent
        ? "bg-primary dark:bg-dark-primary"
        : "hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover"
    }`;
  };

  return (
    <div className="p-4">
      <ul className="space-y-5">
        {files.map((file, index) => (
          <li
            key={file}
            tabIndex={0}
            onClick={(event) => handleItemClick(index, event)}
            className={getItemClassName(file, index)}
            style={{ userSelect: "none" }}
          >
            {file
              .replace(new RegExp(`^${settings.archiveFolderName}/`), "")
              .replace(".txt", "")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
