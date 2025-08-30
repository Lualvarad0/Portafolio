import { useState } from "react";
import { LayoutGrid, Terminal, Globe, Code } from "lucide-react";

export default function WindowManagerUI() {
  const [open, setOpen] = useState(false);

  const windows = [
    { id: 1, title: "Navegador", icon: <Globe size={40} /> },
    { id: 2, title: "Terminal", icon: <Terminal size={40} /> },
    { id: 3, title: "Editor de Código", icon: <Code size={40} /> },
  ];

  return (
    <div className="relative">
      {/* Botón de menú */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-600 rounded-lg"
      >
        <LayoutGrid size={20} />
      </button>

      {/* Overlay y menú */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="grid grid-cols-3 gap-8 bg-gray-900 p-10 rounded-2xl shadow-2xl">
            {windows.map((w) => (
              <div
                key={w.id}
                className="flex flex-col items-center text-center text-white cursor-pointer hover:bg-gray-700 p-5 rounded-xl transition"
              >
                {w.icon}
                <span className="mt-3">{w.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
