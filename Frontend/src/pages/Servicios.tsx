import ServiceCard from "../components/windows/ServiciosWindow";

const servicios = [
  {
    title: "Desarrollo Full Stack",
    description: "Creación de aplicaciones web completas con React, Node.js, Laravel y PHP.",
    icon: "💻"
  },
  {
    title: "Asesoría de Proyectos",
    description: "Revisión y planificación de proyectos, arquitectura y optimización de sistemas.",
    icon: "📊"
  },
  {
    title: "Modelado de Bases de Datos",
    description: "Diseño y optimización de bases de datos relacionales y no relacionales.",
    icon: "🗄️"
  }
];

export default function Servicios() {
  return (
    <section className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-orange-500">Servicios</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {servicios.map((s, i) => (
          <ServiceCard key={i} title={s.title} description={s.description} icon={s.icon} />
        ))}
      </div>
    </section>
  );
}
