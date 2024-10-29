import React from "react";

interface BubbleLogoProps {
  className?: string;
  size?: number;
}

const BubbleLogo: React.FC<BubbleLogoProps> = ({
  className = "",
  size = 128,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className}`}
    >
      {/* Main bubble */}
      <circle
        cx="50"
        cy="50"
        r="40"
        className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
        strokeWidth="2"
      />

      {/* Small bubbles */}
      <circle
        cx="75"
        cy="35"
        r="15"
        className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
        strokeWidth="2"
      />
      <circle
        cx="30"
        cy="70"
        r="10"
        className="fill-text/5 dark:fill-dark-text/5 stroke-text/40 dark:stroke-dark-text/40"
        strokeWidth="2"
      />

      {/* Shine effects */}
      <path
        d="M 45 25 A 30 30 0 0 1 70 35"
        className="stroke-text/20 dark:stroke-dark-text/20"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 25 60 A 20 20 0 0 1 40 65"
        className="stroke-text/20 dark:stroke-dark-text/20"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};

export default BubbleLogo;
