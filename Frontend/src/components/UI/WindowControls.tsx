// src/components/UI/WindowControls.tsx
import React from "react";

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize?: () => void;
}

const WindowControls: React.FC<Props> = ({ onClose, onMinimize, onMaximize }) => {
  const buttonBase =
    "w-3.5 h-3.5 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all";

  return (
    <div className="flex gap-2 items-center pl-2 pt-2">
      {/* Cerrar (rojo) */}
      <span
        onClick={onClose}
        className={`${buttonBase} bg-[#ff5f57] shadow-inner`}
        title="Cerrar"
      />
      {/* Minimizar (amarillo) */}
      <span
        onClick={onMinimize}
        className={`${buttonBase} bg-[#ffbd2e] shadow-inner`}
        title="Minimizar"
      />
      {/* Maximizar (verde) */}
      {onMaximize && (
        <span
          onClick={onMaximize}
          className={`${buttonBase} bg-[#28c940] shadow-inner`}
          title="Maximizar"
        />
      )}
    </div>
  );
};

export default WindowControls;
