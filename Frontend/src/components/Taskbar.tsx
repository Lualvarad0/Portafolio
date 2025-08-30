// src/components/Taskbar.tsx
import React from "react";

interface TaskbarProps {
  activeWindow: string | null;
  minimized: string[];
  setActiveWindow: React.Dispatch<React.SetStateAction<string | null>>;
  setMinimized: React.Dispatch<React.SetStateAction<string[]>>;
}

const Taskbar: React.FC<TaskbarProps> = ({
  activeWindow,
  minimized,
  setActiveWindow,
  setMinimized,
}) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-12 bg-gray-800 flex items-center justify-start gap-2 p-2">
      {minimized.map((win) => (
        <button
          key={win}
          className="bg-gray-700 text-white px-4 py-1 rounded"
          onClick={() => {
            setActiveWindow(win);
            setMinimized((prev) => prev.filter((w) => w !== win));
          }}
        >
          {win}
        </button>
      ))}
    </div>
  );
};

export default Taskbar;
