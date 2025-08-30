import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaGraduationCap,
  FaLaptopCode,
  FaHeart,
  FaMusic,
  FaGamepad,
  FaGlobe,
} from "react-icons/fa";

interface Props {
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

const SobreMiWindow: React.FC<Props> = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white font-sans flex flex-col rounded-none sm:rounded-2xl shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-md px-4 py-3 sm:px-6 flex justify-between items-center border-b border-white/10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Sobre mí</h2>
          </div>

          {/* Contenido */}
          <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8">
            {/* Sección izquierda: Avatar y redes */}
            <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3 gap-4">
              <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src="https://i.imgur.com/4AiXzf8.jpg"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center lg:text-left text-sm sm:text-base lg:text-lg leading-relaxed">
                Hola, soy <span className="font-semibold">Luis David</span>, Ingeniero en Sistemas con pasión por la ciberseguridad y el desarrollo de software. Me encanta aprender, crear y enfrentar desafíos tecnológicos.
              </p>
              {/* Redes sociales */}
              <div className="flex gap-4 sm:gap-6 mt-2">
                <a
                  href="https://github.com/tu-usuario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors"
                >
                  <FaGithub size={22} />
                </a>
                <a
                  href="https://linkedin.com/in/tu-usuario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  <FaLinkedin size={22} />
                </a>
                <a
                  href="https://instagram.com/tu-usuario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500 transition-colors"
                >
                  <FaInstagram size={22} />
                </a>
              </div>
            </div>

            {/* Sección derecha */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Educación */}
              <div className="bg-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                  <FaGraduationCap /> Educación
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <img
                      src="https://play-lh.googleusercontent.com/fAoZQImmYJGymKIVGpXHwuMvz17rYQ8LuCltYwnK6kRNAD-_bw5RFDRVElO4H2_yNA"
                      alt="ECOTEC"
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain flex-shrink-0"
                    />
                    Ingeniero en Sistemas – ECOTEC
                  </li>
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <img
                      src="https://www.iberonex.com/wp-content/uploads/2023/09/obs-business-school.png"
                      alt="OBS"
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain flex-shrink-0"
                    />
                    Posgrado en Ciberseguridad – OBS, España
                  </li>
                </ul>
              </div>

              {/* Experiencia */}
              <div className="bg-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center gap-2">
                  <FaLaptopCode /> Experiencia
                </h3>
                <p className="text-sm sm:text-base leading-relaxed">
                  He trabajado en proyectos de desarrollo web full stack, gestión de bases de datos y seguridad informática. Me apasiona aplicar mis conocimientos en ciberseguridad y desarrollo para crear soluciones robustas.
                </p>
              </div>

              {/* Intereses */}
              <div className="bg-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center gap-2">
                  <FaHeart /> Intereses
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <FaMusic /> Toco guitarra en mis ratos libres.
                  </li>
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <FaGamepad /> Disfruto juegos indie y creativos.
                  </li>
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <FaGlobe /> Interesado en innovación tecnológica y comunidades tech.
                  </li>
                </ul>
              </div>

              {/* Valores */}
              <div className="bg-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Valores</h3>
                <p className="text-sm sm:text-base leading-relaxed">
                  Curiosidad, perseverancia y honestidad guían mi forma de trabajar. Siempre busco aprender, compartir conocimiento y enfrentar desafíos con pasión.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SobreMiWindow;
