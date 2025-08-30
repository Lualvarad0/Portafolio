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
          // className="w-full h-full bg-gradient-to-br from-purple-800 via-indigo-800 to-blue-800 text-white font-sans flex flex-col p-8 gap-8 rounded-2xl shadow-2xl overflow-auto"
        >


          {/* Grid de servicios */}
          {!selectedService ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedService(service.title)}
                  className="p-6 border rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 bg-white/10 backdrop-blur-md flex flex-col items-start gap-4 cursor-pointer"
                >
                  <div className="text-5xl text-blue-400"><service.icon /></div>
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                  <p className="text-white/90">{service.description}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Formulario detallado para el servicio seleccionado
            <ServiceForm 
              serviceName={selectedService} 
              onBack={() => setSelectedService(null)} 
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
