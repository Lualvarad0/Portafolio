import { BrowserRouter, Routes, Route } from "react-router-dom";
import SobreMi from "../pages/SobreMi";
import Habilidades from "../pages/Habilidades";
import Servicios from "../pages/Servicios";
import Contacto from "../pages/Contacto";
import Terminal from "../components/Terminal";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition">
        <div className="p-4">
          <Terminal />
        </div>
        <Routes>
          <Route path="/" element={<SobreMi />} />
          {/* <Route path="/proyectos" element={<Proyectos />} /> */}
          <Route path="/habilidades" element={<Habilidades />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
