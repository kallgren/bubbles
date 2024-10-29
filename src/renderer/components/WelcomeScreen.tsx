import React from "react";
import BubbleLogo from "./BubbleLogo";

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 space-y-8 pb-20">
      <div className="text-center space-y-4">
        <div className="flex flex-col items-center space-y-6">
          <BubbleLogo size={96} className="animate-float" />
          {/* <h1 className="text-3xl font-bold text-text-secondary dark:text-dark-text-secondary">
            No file is open
          </h1> */}
        </div>
        {/* <p className="text-text-secondary dark:text-dark-text-secondary">
          Press <b>Cmd + N</b> to create a new note
        </p> */}
      </div>
    </div>
  );
};

export default WelcomeScreen;
