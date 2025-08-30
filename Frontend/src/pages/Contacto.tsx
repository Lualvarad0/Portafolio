import type { ContactFormProps } from "../interfaces/IForms";
import ContactForm from "../forms/ContacForm";

export default function Contacto() {
  const selectedService: ContactFormProps["service"] = "Servicios Full Stack";

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-orange-500">Contacto</h2>
      <p className="mb-4">
        Si deseas trabajar conmigo, solicitar asesoría o modelado de bases de datos, 
        completa el siguiente formulario:
      </p>
      <ContactForm service={selectedService} />
    </section>
  );
}
