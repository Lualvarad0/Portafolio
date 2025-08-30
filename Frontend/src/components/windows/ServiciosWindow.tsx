import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLaptopCode, FaShieldAlt, FaMobileAlt, FaCloud, FaNetworkWired, FaDatabase } from "react-icons/fa";
import ServiceForm from "../../forms/ServiceForm"; // formulario detallado por servicio

interface Props {
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export default function ServicesWindow({ isActive}: Props) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    { title: "Desarrollo Web", description: "Aplicaciones web modernas, rápidas y seguras.", icon: FaLaptopCode },
    { title: "Ciberseguridad", description: "Protección de sistemas y datos con las mejores prácticas.", icon: FaShieldAlt },
    { title: "Apps Móviles", description: "Aplicaciones móviles intuitivas y de alto rendimiento.", icon: FaMobileAlt },
    { title: "Cloud & DevOps", description: "Implementación en la nube y gestión de infraestructura.", icon: FaCloud },
    { title: "Redes y Sistemas", description: "Configuración de redes y administración de sistemas.", icon: FaNetworkWired },
    { title: "Big Data", description: "Procesamiento y análisis de grandes volúmenes de datos para obtener información valiosa.", icon: FaDatabase },
  ];

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full bg-gradient-to-br from-purple-800 via-indigo-800 to-blue-800 text-white font-sans flex flex-col p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8 rounded-none sm:rounded-2xl shadow-2xl overflow-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center mb-2 sm:mb-0"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {selectedService ? selectedService : "Mis Servicios"}
            </h2>
            {selectedService && (
              <button
                onClick={() => setSelectedService(null)}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm sm:text-base"
              >
                ← Volver
              </button>
            )}
          </motion.div>

          {/* Grid de servicios */}
          {!selectedService ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 flex-1"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedService(service.title)}
                  className="p-4 sm:p-6 border rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white/10 backdrop-blur-md flex flex-col items-start gap-3 sm:gap-4 cursor-pointer min-h-[160px] sm:min-h-[180px] lg:min-h-[200px]"
                >
                  {/* Icono responsivo */}
                  <div className="text-3xl sm:text-4xl lg:text-5xl text-blue-400 flex-shrink-0">
                    <service.icon />
                  </div>
                  
                  {/* Título responsivo */}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
                    {service.title}
                  </h3>
                  
                  {/* Descripción responsiva */}
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed flex-1">
                    {service.description}
                  </p>
                  
                  {/* Indicador de acción */}
                  <div className="text-xs sm:text-sm text-blue-300 opacity-70 mt-auto">
                    Toca para más detalles →
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Formulario detallado para el servicio seleccionado
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-auto"
            >
              <ServiceForm 
                serviceName={selectedService} 
                onBack={() => setSelectedService(null)} 
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}