import { motion } from "framer-motion";
import { AiOutlineUser } from "react-icons/ai";
import { MdBuild, MdCode, MdEmail, MdTerminal } from "react-icons/md";

interface DockProps {
  setActiveWindow: (window: string) => void;
}

export default function Dock({ setActiveWindow }: DockProps) {
  const apps = [
    { name: "SobreMi", icon: <AiOutlineUser /> },
    { name: "Servicios", icon: <MdBuild /> },
    { name: "Habilidades", icon: <MdCode /> },
    { name: "Contacto", icon: <MdEmail /> },
    { name: "Terminal", icon: <MdTerminal /> },
  ];

  return (
    <div className="fixed bottom-4 w-full flex justify-center z-50">
      {/* Contenedor estilo dock */}
      <div className="flex gap-6 px-6 py-3 bg-gray-900/50 rounded-2xl backdrop-blur-md border border-gray-700 shadow-lg">
        {apps.map((app) => (
          <motion.div
            key={app.name}
            whileHover={{ scale: 1.3 }}
            onClick={() => setActiveWindow(app.name)}
            className="cursor-pointer text-white text-3xl"
          >
            {app.icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
