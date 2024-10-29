import React from "react";

interface TitleBarProps {
  className?: string;
  title?: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ className = "", title }) => {
  return (
    <div className={`h-12 w-full flex items-center draggable ${className}`}>
      {title && (
        <div className="flex-1 text-center text-sm font-medium text-text dark:text-dark-text">
          {title}
        </div>
      )}
    </div>
  );
};

export default TitleBar;
