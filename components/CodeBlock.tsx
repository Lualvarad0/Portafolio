// Minimal per-language highlighting: each block shows ONE language.
const LANG = {
  cs: {
    label: "C# · .NET",
    kw: /^(public|sealed|class|async|await|var|if|return|new|is|null|private|readonly)$/,
    type: /^(Task|Result|Factura|Pedido|AppDbContext|ISriClient|FacturaService)$/,
  },
  sql: {
    label: "SQL",
    kw: /^(SELECT|FROM|JOIN|ON|WHERE|GROUP|BY|HAVING|ORDER|ASC|AS|SUM|MAX)$/,
    type: /^$/,
  },
};

export default function CodeBlock({
  filename,
  lang,
  code,
}: {
  filename: string;
  lang: keyof typeof LANG;
  code: string;
}) {
  const rules = LANG[lang];
  return (
    <figure className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-ink-2 shadow-2xl shadow-black/30">
      <figcaption className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" aria-hidden="true" />
        <span className="ml-3 rounded-md bg-white/10 px-2.5 py-1 font-mono text-xs text-signal">{filename}</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-white/40">{rules.label}</span>
      </figcaption>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.75] sm:text-[13px]">
        {code.split("\n").map((line, i) => (
          <div key={i} className="flex">
            <span className="mr-5 w-5 shrink-0 select-none text-right text-white/25" aria-hidden="true">
              {i + 1}
            </span>
            <code className="whitespace-pre text-white/85">
              {line.split(/("[^"]*"|@\w+|\b\d+(?:\.\d+)?m?\b|\w+)/).map((tok, k) => {
                if (!tok) return null;
                let cls = "";
                if (tok.startsWith('"')) cls = "text-[#3ddc97]";
                else if (tok.startsWith("@") || /^\d/.test(tok)) cls = "text-[#ff9b6b]";
                else if (rules.kw.test(tok)) cls = "text-signal";
                else if (rules.type.test(tok)) cls = "text-[#7cc7ff]";
                return (
                  <span key={k} className={cls}>
                    {tok}
                  </span>
                );
              })}
            </code>
          </div>
        ))}
      </pre>
    </figure>
  );
}
