import CalendarUI from "./CalendarUI";
import WindowManagerUI from "./WindowManagerUI";
import ThemeLanguageUI from "./ThemeLanguageUI";

export default function MenuBar() {
  return (
    <div className="w-full h-10 bg-gray-800/70 dark:bg-gray-900 flex items-center justify-between px-4 text-sm text-white">
      {/* Izquierda → Ventanas abiertas */}
      <WindowManagerUI />

      {/* Centro → Calendario */}
      <CalendarUI />

      {/* Derecha → Tema + Idioma */}
      <ThemeLanguageUI />
    </div>
  );
}
