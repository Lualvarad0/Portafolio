import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLinkedin, FaBuilding, FaUsers, FaTools, FaProjectDiagram, FaCalendarAlt } from "react-icons/fa";

interface Props {
  serviceName: string;
  onBack: () => void;
}

interface FormData {
  name: string;
  email: string;
  linkedin: string;
  companySize: string;
  teamSize: string;
  skillsNeeded: string;
  projectType: string;
  deadline: string;
  projectDescription: string;
}

export default function ServiceForm({ serviceName, onBack }: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Datos enviados:", data);
    alert(`Formulario enviado para ${serviceName}`);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full p-8 flex flex-col gap-6 bg-gradient-to-br from-purple-800 via-indigo-800 to-blue-800 rounded-2xl shadow-2xl overflow-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-white">{serviceName}</h2>
        <button onClick={onBack} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition">
          Volver
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Nombre */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center gap-3">
          <FaUser className="text-white text-xl absolute left-3" />
          <input
            {...register("name", { required: true })}
            placeholder="Nombre completo (para dirigirte personalmente)"
            className="pl-10 p-3 rounded-lg w-full bg-white/10 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        {/* Email */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center gap-3">
          <FaEnvelope className="text-white text-xl absolute left-3" />
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Correo electrónico (para responder rápido)"
            className="pl-10 p-3 rounded-lg w-full bg-white/10 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        {/* LinkedIn */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center gap-3">
          <FaLinkedin className="text-white text-xl absolute left-3" />
          <input
            {...register("linkedin")}
            type="url"
            placeholder="LinkedIn (opcional, para conocer tu perfil)"
            className="pl-10 p-3 rounded-lg w-full bg-white/10 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        {/* Company Size */}
        <motion.div whileHover={{ scale: 1.02 }} className="relative flex items-center gap-3">
          <FaBuilding className="text-white text-xl absolute left-3" />
          <select
            {...register("companySize")}
            className="pl-10 p-3 rounded-lg w-full bg-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>Particular</option>
            <option>Pequeña empresa</option>
            <option>Mediana empresa</option>
            <option>Gran empresa</option>
          </select>
        </motion.div>

        {/* Team Size */}
        <motion.div whileHover={{ scale: 1.02 }} className="relative flex items-center gap-3">
          <FaUsers className="text-white text-xl absolute left-3" />
          <select
            {...register("teamSize")}
            className="pl-10 p-3 rounded-lg w-full bg-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>Menos de 5</option>
            <option>5-10</option>
            <option>10-20</option>
            <option>Más de 20</option>
          </select>
        </motion.div>

        {/* Skills Needed */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center gap-3">
          <FaTools className="text-white text-xl absolute left-3" />
          <input
            {...register("skillsNeeded")}
            placeholder="Aptitudes técnicas necesarias (React, Node.js, etc.)"
            className="pl-10 p-3 rounded-lg w-full bg-white/10 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        {/* Project Type */}
        <motion.div whileHover={{ scale: 1.02 }} className="relative flex items-center gap-3">
          <FaProjectDiagram className="text-white text-xl absolute left-3" />
          <select
            {...register("projectType")}
            className="pl-10 p-3 rounded-lg w-full bg-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>Puntual</option>
            <option>Continuo</option>
            <option>Largo plazo</option>
          </select>
        </motion.div>

        {/* Deadline */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center gap-3 flex-col">
          <div className="relative w-full">
            <FaCalendarAlt className="text-white text-xl absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              {...register("deadline")}
              type="date"
              className="pl-10 p-3 rounded-lg w-full bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <span className="text-white/60 text-sm mt-1">
            Fecha límite del proyecto (para organizar prioridades y tiempos)
          </span>
        </motion.div>

        {/* Project Description */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative flex items-center gap-3">
          <textarea
            {...register("projectDescription", { required: true })}
            placeholder="Describe tu proyecto o consulta (objetivos, alcance, desafíos)"
            className="pl-3 p-3 rounded-lg w-full bg-white/10 placeholder-white/70 text-white h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 rounded-lg transition"
        >
          Enviar consulta
        </motion.button>
      </form>
    </motion.div>
  );
}
