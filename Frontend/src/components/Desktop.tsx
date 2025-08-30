import { useState } from "react";
import Menubar from "./UI/MenuBar";
import Dock from "./UI/Dock";
import Window from "./Window";
import Terminal from "./Terminal";
import SobreMiWindow from "./windows/SobreMiWindow";
import ServiciosWindow from "./windows/ServiciosWindow";

export default function Desktop() {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [minimized, setMinimized] = useState<string[]>([]);

  const handleClose = (windowName: string) => {
    if (activeWindow === windowName) setActiveWindow(null);
  };

  const handleMinimize = (windowName: string) => {
    if (!minimized.includes(windowName)) setMinimized([...minimized, windowName]);
    setActiveWindow(null);
  };

  const windows = [
    { name: "SobreMi", content: 
      <SobreMiWindow
        isActive={true}
        onClose={() => console.log("Cerrar")}
        onMinimize={() => console.log("Minimizar")}
      />

     },
    { name: "Servicios", content: 
      <ServiciosWindow 
        isActive={true} 
        onClose={() => console.log("Cerrar")} 
        onMinimize={() => console.log("Minimizar")} 
        /> 
    },
    { name: "Habilidades", content: <div>Contenido Habilidades</div> },
    { name: "Contacto", content: <div>Contenido Contacto</div> },
    { name: "Terminal", content: <Terminal /> },
  ];

  return (
    <div className="w-screen h-screen relative bg-[url('/fondo-escritorio.jpg')] bg-cover overflow-hidden">
      <Menubar />

      {/* Esquina superior izquierda */}
      {/* <div
        className="absolute top-2 left-2 w-10 h-10 cursor-pointer z-50"
        onClick={() => setShowAppMenu(!showAppMenu)}
      >
        <span className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">≡</span>
        {showAppMenu && <AppMenu openApp={setActiveWindow} />}
      </div> */}

      {/* Ventanas */}
      {windows.map((w) => (
        <Window
          key={w.name}
          title={w.name}
          isActive={activeWindow === w.name}
          onClose={() => handleClose(w.name)}
          onMinimize={() => handleMinimize(w.name)}
        >
          {w.content}
        </Window>
      ))}

      {/* Preview ventanas minimizadas */}
      {/* <PreviewWindows minimized={minimized} restoreWindow={restoreWindow} /> */}

      {/* Dock */}
      <Dock setActiveWindow={setActiveWindow} />
    </div>
  );
}
