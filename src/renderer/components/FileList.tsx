import React, { useState, useRef } from "react";

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
    startIndex: number
  ) => (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ul className="space-y-1">
        {files.map((file, idx) => {
          const index = startIndex + idx;
          return (
            <li
              key={file}
              tabIndex={0}
              onClick={(event) => handleItemClick(index, event)}
              className={`text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedFiles.has(index) ? "bg-blue-100" : ""
              }`}
              style={{ userSelect: "none" }}
            >
              {file.replace(/^archive\//, "").replace(".txt", "")}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="p-4">
      {renderFileSection(activeFiles, "Text Files", 0)}
      {archivedFiles.length > 0 &&
        renderFileSection(archivedFiles, "Archive", activeFiles.length)}
    </div>
  );
};

export default FileList;
