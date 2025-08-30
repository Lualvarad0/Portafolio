import { useTheme } from "next-themes";
import { useState } from "react";
import { Sun, Moon, Keyboard } from "lucide-react";

export default function ThemeLanguageUI() {
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState("ES");

  return (
    <div className="flex items-center gap-4">
      {/* Cambiar tema */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 hover:bg-gray-600 rounded-lg"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Cambiar idioma/teclado */}
      <button
        onClick={() => setLang(lang === "ES" ? "EN" : "ES")}
        className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-lg text-white"
      >
        <Keyboard size={16} />
        {lang}
      </button>
    </div>
  );
}
