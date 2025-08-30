import type { JSX } from "react";

interface AppMenuProps {
  windows: { name: string; icon: JSX.Element }[];
  openApp: (name: string) => void;
  onClose: () => void;
}

export default function AppMenu({ windows, openApp, onClose }: AppMenuProps) {
  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-40">
      <h2 className="text-white text-xl mb-6">Aplicaciones</h2>
      <div className="grid grid-cols-3 gap-8">
        {windows.map((w) => (
          <div
            key={w.name}
            onClick={() => {
              openApp(w.name);
              onClose();
            }}
            className="flex flex-col items-center text-white cursor-pointer hover:scale-110 transition"
          >
            <div className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center shadow-md">
              {w.icon}
            </div>
            <span className="mt-2">{w.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
