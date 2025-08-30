// src/components/Taskbar.tsx
import React from "react";
import { Monitor, Folder, Settings, Mail } from "lucide-react"; // Ejemplo de íconos
import type { JSX } from "react/jsx-runtime";

interface TaskbarProps {
  activeWindow: string | null;
  minimized: string[];
  setActiveWindow: React.Dispatch<React.SetStateAction<string | null>>;
  setMinimized: React.Dispatch<React.SetStateAction<string[]>>;
}

const icons: Record<string, JSX.Element> = {
  "Explorador": <Folder size={20} />,
  "Configuración": <Settings size={20} />,
  "Correo": <Mail size={20} />,
  "Terminal": <Monitor size={20} />,
};

const Taskbar: React.FC<TaskbarProps> = ({
  activeWindow,
  minimized,
  setActiveWindow,
  setMinimized,
}) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-14 bg-gray-900/90 backdrop-blur-md flex items-center gap-3 px-3 border-t border-gray-700 shadow-lg">
      {minimized.map((win) => (
        <button
          key={win}
          className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all hover:bg-gray-700 hover:scale-105 ${
            activeWindow === win ? "bg-gray-700 shadow-md" : ""
          }`}
          onClick={() => {
            setActiveWindow(win);
            setMinimized((prev) => prev.filter((w) => w !== win));
          }}
        >
          {/* Ícono */}
          {icons[win] || <Monitor size={20} />}
          {/* Nombre reducido */}
          <span className="text-xs text-gray-200 mt-1 truncate max-w-[70px]">
            {win}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Taskbar;
