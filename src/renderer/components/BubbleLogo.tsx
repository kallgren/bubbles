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
    const factor = 1 + zDistance * 0.5;
    const x = (mousePos.x * factor) / 20;
    const y = (mousePos.y * factor) / 20;

    return {
      "--mouse-x": `${x}px`,
      "--mouse-y": `${y}px`,
    } as React.CSSProperties;
  };

  const getMouthGape = () => {
    // Calculate distance from mouse to center
    const distance = Math.sqrt(mousePos.x ** 2 + mousePos.y ** 2);
    // Max distance for mouth movement (adjust as needed)
    const maxDistance = 200;
    // Max gape amount in pixels
    const maxGape = 15;
    // Inverse relationship - closer = more gape
    const gape = maxGape * (1 - Math.min(distance / maxDistance, 1));
    return gape;
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
          {/* Shine */}
          <path
            d="M 35 25 A 30 30 0 0 1 75 30"
            className="stroke-text/20 dark:stroke-dark-text/20"
            strokeWidth="2"
            fill="none"
          />
          {/* Eyes */}
          <g>
            {/* Left eye */}
            <circle
              cx="35"
              cy="40"
              r="5"
              className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
              strokeWidth="2"
            />
            <circle
              cx={`${35 + (mousePos.x / 100) * 2}`}
              cy={`${40 + (mousePos.y / 100) * 2}`}
              r="2"
              className="fill-text/40 dark:fill-dark-text/40"
            />

            {/* Right eye */}
            <circle
              cx="65"
              cy="40"
              r="5"
              className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
              strokeWidth="2"
            />
            <circle
              cx={`${65 + (mousePos.x / 100) * 2}`}
              cy={`${40 + (mousePos.y / 100) * 2}`}
              r="2"
              className="fill-text/40 dark:fill-dark-text/40"
            />
          </g>
          {/* Gaping mouth that opens based on mouse proximity */}
          <path
            d={`M 35 55 
               C 35 ${55 + getMouthGape()} 
               65 ${55 + getMouthGape()} 
               65 55`}
            className="stroke-text/40 dark:stroke-dark-text/40"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Medium bubble - medium float */}
        <g className="animate-float-medium" style={getStyle(1)}>
          <circle
            cx="85"
            cy="45"
            r="15"
            className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
            strokeWidth="2"
          />
          <path
            d="M 80 35 A 12 12 0 0 1 95 40"
            className="stroke-text/20 dark:stroke-dark-text/20"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* Small bubble - smallest float */}
        <g className="animate-float-small" style={getStyle(2)}>
          <circle
            cx="15"
            cy="50"
            r="10"
            className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
            strokeWidth="2"
          />
          <path
            d="M 10 45 A 8 8 0 0 1 20 48"
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
