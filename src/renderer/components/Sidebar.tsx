import React, { useRef, useEffect } from "react";
import FileList from "./FileList";
import TitleBar from "./TitleBar";

interface SidebarProps {
  width: number;
  setWidth: (width: number) => void;
  currentFolder: string | null;
  activeFiles: string[];
  archivedFiles: string[];
  currentFile: string | null;
  onFileSelect: (filePath: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  width,
  setWidth,
  currentFolder,
  activeFiles,
  archivedFiles,
  currentFile,
  onFileSelect,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizer = resizerRef.current;
    let startX: number;
    let startWidth: number;

    function startResizing(e: MouseEvent) {
      startX = e.clientX;
      startWidth = sidebarRef.current?.offsetWidth || 0;
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResizing);
    }

    function resize(e: MouseEvent) {
      const newWidth = startWidth + e.clientX - startX;
      if (newWidth > 100 && newWidth < 600) {
        setWidth(newWidth);
      }
    }

    function stopResizing() {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    }

    resizer?.addEventListener("mousedown", startResizing);

    return () => {
      resizer?.removeEventListener("mousedown", startResizing);
    };
  }, [setWidth]);

  return (
    <div className="flex flex-col" style={{ width: `${width}px` }}>
      <div
        ref={sidebarRef}
        className="relative border-r border-border dark:border-dark-border overflow-y-auto flex-1"
      >
        <div
          ref={resizerRef}
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary-hover dark:hover:bg-dark-border active:bg-secondary-hover dark:active:bg-dark-secondary-hover"
        />
        <TitleBar />
        {currentFolder && (
          <FileList
            activeFiles={activeFiles}
            archivedFiles={archivedFiles}
            currentFile={currentFile}
            onFileSelect={onFileSelect}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
