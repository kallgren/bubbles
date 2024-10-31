import React, { useMemo } from "react";
import BubbleLogo from "./BubbleLogo";
import { WELCOME_MESSAGES } from "../../config";

const WelcomeScreen = () => {
  const randomMessage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    return WELCOME_MESSAGES[randomIndex];
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 space-y-8 pb-20">
      <div className="text-center space-y-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-float">
            <BubbleLogo size={120} />
          </div>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            {randomMessage}
          </p>
          <p className="text-xs text-text-tertiary dark:text-dark-text-tertiary">
            <b>Cmd + N</b> to create a new file
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
