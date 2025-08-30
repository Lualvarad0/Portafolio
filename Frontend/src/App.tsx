import { useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";

export default function App() {
  const [booting, setBooting] = useState(true);
  
  if (booting) {
    return <BootScreen onFinish={() => setBooting(false)} />;
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <Desktop/>

      {/* <AnimatePresence>
        {activeWindow === "SobreMi" && !minimized.includes("SobreMi") && (
          <SobreMiWindow
            isActive={true}
            onClose={() => setActiveWindow(null)}
            onMinimize={() =>
              setMinimized((prev) => [...prev, "SobreMi"])
            }
          />
        )}
        {activeWindow === "Contacto" && !minimized.includes("Contacto") && (
          <ContactoWindow
            isActive={true}
            onClose={() => setActiveWindow(null)}
            onMinimize={() =>
              setMinimized((prev) => [...prev, "Contacto"])
            }
          />
        )}
      </AnimatePresence> */}

    </div>
  );
}
