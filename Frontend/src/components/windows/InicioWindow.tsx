import React from "react";
import Window from "../Window";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import type { ISocial } from "../../interfaces/ISocial";

interface Props {
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

const InicioWindow: React.FC<Props> = ({ isActive, onClose, onMinimize }) => {
  const socials: ISocial[] = [
    { name: "GitHub", url: "https://github.com/tuusuario", icon: <FaGithub /> },
    { name: "LinkedIn", url: "https://linkedin.com/in/tuusuario", icon: <FaLinkedin /> },
    { name: "Twitter", url: "https://twitter.com/tuusuario", icon: <FaTwitter /> },
  ];

  return (
    <Window
      title="Inicio"
      isActive={isActive}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className="flex flex-col items-center text-center space-y-4 p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-cyan-400">
          Bienvenido a mi Portafolio
        </h1>
        <p className="text-lg text-gray-300 dark:text-gray-400 max-w-xl">
          Soy un desarrollador Full Stack especializado en proyectos web seguros,
          modelado de bases de datos y asesorías en proyectos tecnológicos.
        </p>
        <div className="flex gap-4 mt-4">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-2xl text-gray-300 hover:text-cyan-400 transition-colors"
            >
              {s.icon}
            </a>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="px-3 py-1 rounded bg-gray-700 dark:bg-gray-800 text-cyan-400 font-mono">
            React
          </span>
          <span className="px-3 py-1 rounded bg-gray-700 dark:bg-gray-800 text-cyan-400 font-mono">
            TypeScript
          </span>
          <span className="px-3 py-1 rounded bg-gray-700 dark:bg-gray-800 text-cyan-400 font-mono">
            TailwindCSS
          </span>
          <span className="px-3 py-1 rounded bg-gray-700 dark:bg-gray-800 text-cyan-400 font-mono">
            Node.js
          </span>
          <span className="px-3 py-1 rounded bg-gray-700 dark:bg-gray-800 text-cyan-400 font-mono">
            PostgreSQL
          </span>
        </div>
      </div>
    </Window>
  );
};

export default InicioWindow;
