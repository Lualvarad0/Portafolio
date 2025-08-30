import React from "react";
import Window from "../Window";

interface Props {
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

const ContactoWindow: React.FC<Props> = ({ isActive, onClose, onMinimize }) => {
  return (
    <Window title="Contacto" isActive={isActive} onClose={onClose} onMinimize={onMinimize}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Contacto</h2>
        <p>Aquí puedes dejar tus solicitudes de trabajo o asesorías.</p>
      </div>
    </Window>
  );
};

// ✅ Esto es importante: export default
export default ContactoWindow;
