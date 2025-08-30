// src/components/Window.tsx
import React from "react";
import { motion } from "framer-motion";
import type { IWindow } from "../interfaces/Iwindow";
import WindowControls from "./UI/WindowControls";

const Window: React.FC<IWindow & { children: React.ReactNode }> = ({
  title,
  isActive,
  onClose,
  onMinimize,
  children,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: -30 }}
      animate={{
        scale: isActive ? 1 : 0.95,
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 20,
      }}
      exit={{ scale: 0.9, opacity: 0, y: 40 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`
        absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[650px]
        bg-neutral-900/80 backdrop-blur-xl
        border border-neutral-700 rounded-2xl
        shadow-[0_0_25px_rgba(100,108,255,0.5)]
        overflow-hidden
        ${isActive ? "z-50" : "z-30"}
      `}
    >
      {/* Header estilo macOS */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800/60 border-b border-neutral-700 relative">
        {/* Controles macOS en la esquina izquierda */}
        <WindowControls 
          onClose={onClose} 
          onMinimize={onMinimize} 
          onMaximize={() => {}} 
        />

        {/* Título centrado */}
        <span className="absolute left-1/2 -translate-x-1/2 font-semibold text-gray-200 text-sm">
          {title}
        </span>

        {/* Espacio a la derecha para balancear el header */}
        <div className="w-12" />
      </div>

      {/* Contenido de la ventana - fondo blanco */}
      <div className="h-[calc(100%-40px)] overflow-y-auto p-6 rounded-b-2xl">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
