import { useState } from "react";
import type { ContactFormProps } from "../interfaces/IForms";

const initialState = {
  name: "",
  email: "",
  message: "",
};

export default function ContactForm({ service }: ContactFormProps) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Nombre es requerido";
    if (!formData.email) newErrors.email = "Email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.message) newErrors.message = "Mensaje es requerido";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    // Aquí enviarías los datos al backend
    console.log({ ...formData, service });
    setSubmitted(true);
    setFormData(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-gray-800 dark:bg-gray-900 rounded shadow-md">
      {service && (
        <p className="text-sm text-green-400">
          Servicio seleccionado: <span className="font-semibold">{service}</span>
        </p>
      )}
      <input
        type="text"
        name="name"
        placeholder="Nombre completo"
        value={formData.name}
        onChange={handleChange}
        className="p-2 rounded bg-gray-700 dark:bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}

      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        className="p-2 rounded bg-gray-700 dark:bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

      <textarea
        name="message"
        placeholder="Mensaje"
        rows={4}
        value={formData.message}
        onChange={handleChange}
        className="p-2 rounded bg-gray-700 dark:bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}

      <button type="submit" className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold p-2 rounded">
        Enviar
      </button>

      {submitted && <p className="text-green-400 mt-2">Formulario enviado con éxito!</p>}
    </form>
  );
}
