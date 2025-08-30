import SkillBadge from "../components/windows/HabilidadesWindow";

const habilidades = ["React", "TypeScript", "Node.js", "Laravel", "PHP", "SQL", "AWS", "Docker", "Linux", "UX/UI"];

export default function Habilidades() {
  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-orange-500">Habilidades</h2>
      <div className="flex flex-wrap gap-3">
        {habilidades.map((h, i) => (
          <SkillBadge key={i} skill={h} />
        ))}
      </div>
    </section>
  );
}
