// src/components/SobreMiWindow.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaGraduationCap, FaLaptopCode, FaHeart, FaMusic, FaGamepad, FaGlobe } from 'react-icons/fa';

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
          className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white font-sans flex flex-col p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8 rounded-none sm:rounded-2xl shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center mb-2 sm:mb-0"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Sobre mí</h2>
          </motion.div>

          {/* Contenido */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Sección izquierda: Avatar y redes */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center lg:items-start w-full lg:w-1/3 gap-4 sm:gap-6"
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src="https://i.imgur.com/4AiXzf8.jpg"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center lg:text-left text-sm sm:text-base lg:text-lg leading-relaxed px-2 lg:px-0">
                Hola, soy <span className="font-semibold">Luis David</span>, Ingeniero en Sistemas con una pasión por la ciberseguridad y el desarrollo de software. Me encanta aprender, crear y enfrentar desafíos tecnológicos.
              </p>
              <div className="flex gap-4 sm:gap-6 mt-2 sm:mt-4">
                <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors">
                  <FaGithub size={24} className="sm:w-8 sm:h-8" />
                </a>
                <a href="https://linkedin.com/in/tu-usuario" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition-colors">
                  <FaLinkedin size={24} className="sm:w-8 sm:h-8" />
                </a>
                <a href="https://instagram.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500 transition-colors">
                  <FaInstagram size={24} className="sm:w-8 sm:h-8" />
                </a>
              </div>
            </motion.div>

            {/* Sección derecha: Información */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 flex flex-col gap-4 sm:gap-6 lg:gap-8"
            >
              {/* Educación */}
              <div className="bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-md">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-base sm:text-lg lg:text-xl" /> 
                  Educación
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <img src="https://play-lh.googleusercontent.com/fAoZQImmYJGymKIVGpXHwuMvz17rYQ8LuCltYwnK6kRNAD-_bw5RFDRVElO4H2_yNA" alt="ECOTEC" className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"/>
                    <span className="leading-tight">Ingeniero en Sistemas – ECOTEC</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <img src="https://www.iberonex.com/wp-content/uploads/2023/09/obs-business-school.png" alt="OBS" className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"/>
                    <span className="leading-tight">Posgrado en Ciberseguridad – Universidad OBS, España</span>
                  </li>
                </ul>
              </div>

              {/* Experiencia */}
              <div className="bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-md">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <FaLaptopCode className="text-base sm:text-lg lg:text-xl" /> 
                  Experiencia
                </h3>
                <p className="text-sm sm:text-base leading-relaxed">
                  He trabajado en proyectos de desarrollo web full stack, gestión de bases de datos y seguridad informática. Me apasiona aplicar mis conocimientos en ciberseguridad y desarrollo para crear soluciones robustas y proteger la información de los usuarios.
                </p>
              </div>

              {/* Intereses y pasatiempos */}
              <div className="bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-md">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <FaHeart className="text-base sm:text-lg lg:text-xl" /> 
                  Intereses y Pasatiempos
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <FaMusic className="text-sm sm:text-base flex-shrink-0" /> 
                    <span>Toco guitarra en mis ratos libres.</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <FaGamepad className="text-sm sm:text-base flex-shrink-0" /> 
                    <span>Disfruto juegos indie y experiencias creativas.</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <FaLaptopCode className="text-sm sm:text-base flex-shrink-0" /> 
                    <span>Apasionado por ciberseguridad y desarrollo.</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm sm:text-base">
                    <FaGlobe className="text-sm sm:text-base flex-shrink-0" /> 
                    <span>Me interesa innovación tecnológica y comunidades tech.</span>
                  </li>
                </ul>
              </div>

              {/* Valores personales */}
              <div className="bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-md shadow-md">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3">Valores</h3>
                <p className="text-sm sm:text-base leading-relaxed">
                  Curiosidad, perseverancia y honestidad guían mi forma de trabajar y vivir. Siempre busco aprender, compartir conocimiento y enfrentar desafíos con pasión.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SobreMiWindow;