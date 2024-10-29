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

  const getTransform = (zDistance: number) => {
    const factor = 1 / (1 + zDistance * 0.5);
    const x = (mousePos.x * factor) / 20;
    const y = (mousePos.y * factor) / 20;
    return `translate(${x}px, ${y}px)`;
  };

  return (
    <div ref={containerRef} className={className}>
      <svg
        width={size}
        height={size}
        viewBox="-10 -10 120 120"
        className="transition-transform duration-200"
        style={{ overflow: "visible" }}
      >
        {/* Main bubble - closest to viewer */}
        <g style={{ transform: getTransform(0) }}>
          <circle
            cx="50"
            cy="50"
            r="40"
            className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
            strokeWidth="2"
          />
          {/* Large shine for main bubble - increased strokeWidth to 3 */}
          <path
            d="M 45 25 A 30 30 0 0 1 70 35"
            className="stroke-text/20 dark:stroke-dark-text/20"
            strokeWidth="3"
            fill="none"
          />
        </g>

        {/* Medium distance bubble */}
        <g style={{ transform: getTransform(1) }}>
          <circle
            cx="75"
            cy="35"
            r="15"
            className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
            strokeWidth="2"
          />
        </g>

        {/* Furthest bubble with its shine */}
        <g style={{ transform: getTransform(2) }}>
          <circle
            cx="30"
            cy="70"
            r="10"
            className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
            strokeWidth="2"
          />
          {/* Small shine */}
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
