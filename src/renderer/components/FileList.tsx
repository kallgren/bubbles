import React, { useState, useRef } from "react";
import { ARCHIVE_FOLDER } from "../../config";

interface FileListProps {
  activeFiles: string[];
  archivedFiles: string[];
  onFileSelect: (filePath: string) => void;
}

const FileList: React.FC<FileListProps> = ({
  activeFiles,
  archivedFiles,
  onFileSelect,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const lastSelectedIndex = useRef<number | null>(null);

  const handleItemClick = (index: number, event: React.MouseEvent) => {
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
  };

  const renderFileSection = (
    files: string[],
    title: string,
    startIndex: number,
    isArchive = false
  ) => (
    <div className="mb-6">
      <button
        onClick={() => isArchive && setIsArchiveOpen(!isArchiveOpen)}
        className="flex items-center w-full text-lg font-semibold mb-2 cursor-default"
        disabled={!isArchive}
      >
        {isArchive && (
          <span className="mr-1 text-sm">{isArchiveOpen ? "▼" : "▶"}</span>
        )}
        {title}
      </button>
      {(!isArchive || isArchiveOpen) && (
        <ul className="space-y-1">
          {files.map((file, idx) => {
            const index = startIndex + idx;
            return (
              <li
                key={file}
                tabIndex={0}
                onClick={(event) => handleItemClick(index, event)}
                className={`text-sm text-text-secondary dark:text-dark-text-secondary hover:text-text dark:hover:text-dark-text hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectedFiles.has(index)
                    ? "bg-secondary-hover dark:bg-dark-secondary-hover"
                    : ""
                }`}
                style={{ userSelect: "none" }}
              >
                {file
                  .replace(new RegExp(`^${ARCHIVE_FOLDER}/`), "")
                  .replace(".txt", "")}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-4">
      {renderFileSection(activeFiles, "Bubbles", 0)}
      {archivedFiles.length > 0 &&
        renderFileSection(archivedFiles, "Archive", activeFiles.length, true)}
    </div>
  );
};

export default FileList;
