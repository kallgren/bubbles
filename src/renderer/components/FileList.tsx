import React from "react";

interface FileListProps {
  files: string[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Text Files</h2>
      <ul className="space-y-1">
        {files.map((file, index) => (
          <li key={index} className="text-sm text-gray-700 hover:text-gray-900">
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
