import React from "react";
import BubbleLogo from "./BubbleLogo";

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 space-y-8 pb-20">
      <div className="text-center space-y-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-float">
            <BubbleLogo size={120} />
          </div>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            Hey, what ya lookin' at?
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
