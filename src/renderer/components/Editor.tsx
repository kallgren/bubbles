import React from "react";

interface EditorProps {
  filename: string | null;
  content: string | null;
  onChange?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ filename, content, onChange }) => {
  const displayName = filename?.replace(".txt", "");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col bg-primary dark:bg-dark-primary h-full">
      <div className="p-4">
        <span className="font-bold text-2xl">{displayName}</span>
      </div>
      <div className="p-4 flex-1">
        <textarea
          className="w-full h-full border-none outline-none resize-none bg-transparent"
          value={content ?? ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Editor;
