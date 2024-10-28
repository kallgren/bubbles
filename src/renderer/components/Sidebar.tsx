import React, { useRef, useEffect } from "react";

interface SidebarProps {
  width: number;
  setWidth: (width: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ width, setWidth }) => {
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
    <div
      ref={sidebarRef}
      className="relative bg-gray-100 border-r border-gray-200"
      style={{ width: `${width}px` }}
    >
      <div
        ref={resizerRef}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-gray-300 active:bg-gray-400"
      />
    </div>
  );
};

export default Sidebar;
