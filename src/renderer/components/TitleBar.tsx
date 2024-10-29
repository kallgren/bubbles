import React from "react";

interface TitleBarProps {
  className?: string;
  title?: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ className = "", title }) => {
  return (
    <div className={`h-8 w-full flex items-center draggable ${className}`}>
      {title && (
        <div className="flex-1 text-center text-sm font-medium text-gray-600">
          {title}
        </div>
      )}
    </div>
  );
};

export default TitleBar;
