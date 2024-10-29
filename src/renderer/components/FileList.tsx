import React, { useState, useRef } from "react";

interface FileListProps {
  files: string[];
  onFileSelect: (filePath: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onFileSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const lastSelectedIndex = useRef<number | null>(null);

  const handleItemClick = async (index: number, event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey) {
      // Cmd (Mac) or Ctrl (Windows) for toggling selection
      setSelectedFiles((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(index)) {
          newSelected.delete(index);
        } else {
          newSelected.add(index);
        }
        lastSelectedIndex.current = index;
        return newSelected;
      });
    } else if (event.shiftKey && lastSelectedIndex.current !== null) {
      // Shift for range selection
      const start = Math.min(lastSelectedIndex.current, index);
      const end = Math.max(lastSelectedIndex.current, index);
      setSelectedFiles((prevSelected) => {
        const newSelected = new Set(prevSelected);
        for (let i = start; i <= end; i++) {
          newSelected.add(i);
        }
        return newSelected;
      });
    } else {
      // Single selection
      setSelectedFiles(new Set([index]));
      lastSelectedIndex.current = index;
      const filePath = files[index];
      onFileSelect(filePath);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Text Files</h2>
      <ul className="space-y-1">
        {files.map((file, index) => (
          <li
            key={index}
            tabIndex={0}
            onClick={(event) => handleItemClick(index, event)}
            className={`text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selectedFiles.has(index) ? "bg-blue-100" : ""
            }`}
            style={{ userSelect: "none" }} // Disable text selection
          >
            {file.replace(".txt", "")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
