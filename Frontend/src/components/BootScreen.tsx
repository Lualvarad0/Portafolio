import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BootScreen({ onFinish }: { onFinish: () => void }) {
  const text = "Inicializando entorno... ";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setTimeout(onFinish, 1500); // pasa al escritorio
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="h-screen w-screen flex items-center justify-center 
                 bg-black text-green-400 font-mono text-lg"
    >
      <p>{displayed}<span className="animate-pulse">█</span></p>
    </motion.div>
  );
}
