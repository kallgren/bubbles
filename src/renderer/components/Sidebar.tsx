import React, { useRef, useEffect, useState } from "react";
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
  const [showArchive, setShowArchive] = useState(false);
  const [isArchiveHovered, setIsArchiveHovered] = useState(false);
  const [isArchivePinned, setIsArchivePinned] = useState(false);
  const [archiveHeight, setArchiveHeight] = useState(200);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const archiveResizerRef = useRef<HTMLDivElement>(null);

  // Existing width resize logic
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
    return () => resizer?.removeEventListener("mousedown", startResizing);
  }, [setWidth]);

  const handleArchiveClick = () => {
    const newPinnedState = !isArchivePinned;
    setIsArchivePinned(newPinnedState);
    if (!newPinnedState) {
      setShowArchive(false);
      setIsArchiveHovered(false);
    }
  };

  // Show archive on either hover or pin
  useEffect(() => {
    setShowArchive(isArchiveHovered || isArchivePinned);
  }, [isArchiveHovered, isArchivePinned]);

  return (
    <div className="flex flex-col" style={{ width: `${width}px` }}>
      <div
        ref={sidebarRef}
        className="relative flex flex-col border-r border-border dark:border-dark-border h-screen"
      >
        <div
          ref={resizerRef}
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary-hover dark:hover:bg-dark-border active:bg-secondary-hover dark:active:bg-dark-secondary-hover"
        />
        <TitleBar />

        {/* Main file list */}
        <div className="flex-1 overflow-y-auto">
          {currentFolder && (
            <FileList
              activeFiles={activeFiles}
              archivedFiles={[]}
              currentFile={currentFile}
              onFileSelect={onFileSelect}
            />
          )}
        </div>

        {/* Archive section */}
        <div className="relative border-t border-border dark:border-dark-border">
          {/* Floating archive button (shown unless archive is pinned) */}
          {!isArchivePinned && (
            <button
              onClick={handleArchiveClick}
              onMouseEnter={() => setIsArchiveHovered(true)}
              className="absolute bottom-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-border dark:border-dark-border shadow-md hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover text-text-secondary dark:text-dark-text-secondary"
              title="Show Archive"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-14 0l2 3h8l2-3"
                />
              </svg>
            </button>
          )}

          {/* Archive content container */}
          <div
            onMouseEnter={() => setIsArchiveHovered(true)}
            onMouseLeave={() => setIsArchiveHovered(false)}
            className="overflow-hidden"
            style={
              {
                "--expanded-height": `${archiveHeight + 32}px`,
              } as React.CSSProperties
            }
          >
            <div
              className={`${
                showArchive ? "animate-slide-down" : "animate-slide-up"
              }`}
            >
              <div
                ref={archiveResizerRef}
                className="cursor-row-resize"
                onMouseDown={(e) => {
                  e.preventDefault();
                  let isDragging = false;
                  const startY = e.clientY;
                  const startHeight = archiveHeight;

                  // Pin the archive if it's not already pinned
                  if (!isArchivePinned) {
                    setIsArchivePinned(true);
                  }

                  const handleMouseMove = (e: MouseEvent) => {
                    isDragging = true;
                    const dy = e.clientY - startY;
                    const newHeight = Math.max(
                      50,
                      Math.min(startHeight - dy, window.innerHeight - 150)
                    );
                    setArchiveHeight(newHeight);
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                    document.body.style.cursor = "";
                  };

                  document.addEventListener("mousemove", handleMouseMove);
                  document.addEventListener("mouseup", handleMouseUp);
                  document.body.style.cursor = "row-resize";
                }}
              >
                <div className="w-full px-4 py-2 text-[11px] flex items-center justify-between uppercase font-medium tracking-wider text-text-secondary dark:text-dark-text-secondary hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover group">
                  <span>Archive</span>
                  <button
                    onClick={handleArchiveClick}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-1 ${
                      isArchivePinned
                        ? "hover:bg-red-500 hover:stroke-white hover:text-white"
                        : "hover:bg-green-500 hover:stroke-white hover:text-white"
                    }`}
                  >
                    {isArchivePinned ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div
                className="overflow-y-auto border-t border-border dark:border-dark-border"
                style={{ height: `${archiveHeight}px` }}
              >
                <FileList
                  activeFiles={[]}
                  archivedFiles={archivedFiles}
                  currentFile={currentFile}
                  onFileSelect={onFileSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
