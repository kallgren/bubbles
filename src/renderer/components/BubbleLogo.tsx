import React, { useRef, useEffect, useState } from "react";

interface BubbleLogoProps {
  className?: string;
  size?: number;
}

const BubbleLogo: React.FC<BubbleLogoProps> = ({
  className = "",
  size = 128,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setMousePos({ x: e.clientX - centerX, y: e.clientY - centerY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getStyle = (zDistance: number) => {
    const factor = 1 / (1 + zDistance * 0.5);
    const x = (mousePos.x * factor) / 20;
    const y = (mousePos.y * factor) / 20;

    return {
      "--mouse-x": `${x}px`,
      "--mouse-y": `${y}px`,
    } as React.CSSProperties;
  };

  return (
    <div ref={containerRef} className={className}>
      <svg
        width={size}
        height={size}
        viewBox="-10 -10 120 120"
        style={{ overflow: "visible" }}
      >
        {/* Main bubble - largest float */}
        <g className="animate-float-large" style={getStyle(0)}>
          <circle
            cx="50"
            cy="50"
            r="40"
            className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
            strokeWidth="2"
          />
          <path
            d="M 35 25 A 30 30 0 0 1 75 30"
            className="stroke-text/20 dark:stroke-dark-text/20"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Medium bubble - medium float */}
        <g className="animate-float-medium" style={getStyle(1)}>
          <circle
            cx="75"
            cy="35"
            r="15"
            className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
            strokeWidth="2"
          />
          <path
            d="M 70 25 A 12 12 0 0 1 85 30"
            className="stroke-text/20 dark:stroke-dark-text/20"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Small bubble - smallest float */}
        <g className="animate-float-small" style={getStyle(2)}>
          <circle
            cx="30"
            cy="70"
            r="10"
            className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
            strokeWidth="2"
          />
          <path
            d="M 25 65 A 8 8 0 0 1 35 68"
            className="stroke-text/20 dark:stroke-dark-text/20"
            strokeWidth="2"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};

export default BubbleLogo;
