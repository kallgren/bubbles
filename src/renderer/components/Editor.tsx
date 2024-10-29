import React from "react";

interface EditorProps {
  filename: string | null;
  content: string | null;
}

const Editor: React.FC<EditorProps> = ({ filename, content }) => {
  const displayName = filename?.replace(".txt", "");

  return (
    <div className="flex flex-col bg-primary dark:bg-dark-primary h-full">
      <div className="p-4">
        <span className="font-bold text-2xl">{displayName}</span>
      </div>
      <div className="p-4 flex-1">
        <textarea
          className="w-full h-full border-none outline-none resize-none bg-transparent"
          value={content ?? ""}
          readOnly
        />
      </div>
    </div>
  );
};

export default Editor;
