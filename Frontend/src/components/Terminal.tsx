import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

interface Command {
  input: string;
  output: string;
}

interface TerminalProps {
  onClose?: () => void; // Para cerrar la terminal con exit
  openApp?: (appName: string) => void; // Abrir apps
  minimizeApp?: (appName: string) => void; // Minimizar apps
}

export default function Terminal({ onClose, openApp, minimizeApp }: TerminalProps) {
  const location = useLocation();
  const [commandInput, setCommandInput] = useState("");
  const [history, setHistory] = useState<Command[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filesByPath: Record<string, string[]> = {
    "~/inicio": ["SobreMi", "Servicios", "Habilidades", "Contacto", "Terminal"],
    "~/sobre-mi": ["cv.pdf", "foto.png"],
    "~/servicios": ["proyectos.txt", "detalles.pdf"],
    "~/habilidades": ["frontend", "backend", "fullstack"],
    "~/contacto": ["correo.txt", "formulario.html"],
    "~/": ["inicio"],
  };

  const getPath = () => {
    switch (location.pathname) {
      case "/": return "~/inicio";
      case "/sobre-mi": return "~/sobre-mi";
      case "/servicios": return "~/servicios";
      case "/habilidades": return "~/habilidades";
      case "/contacto": return "~/contacto";
      default: return "~/";
    }
  };

  const executeCommand = (input: string) => {
    const path = getPath();
    let output = "";

    const [cmd, ...args] = input.trim().split(" ");

    switch (cmd) {
      case "ls":
        output = filesByPath[path].join("  ");
        break;
      case "cd":
        if (args[0] && Object.keys(filesByPath).includes(args[0])) {
          output = `cd: moved to ${args[0]}`;
        } else {
          output = `cd: ${args[0] || ""}: No such directory`;
        }
        break;
      case "help":
        output = "Comandos: ls, cd <dir>, help, clear, exit, whoami, pwd, open <app>, minimize <app>, about, date";
        break;
      case "clear":
        setHistory([]);
        return;
      case "exit":
        onClose?.();
        return;
      case "whoami":
        output = "user@webOS";
        break;
      case "pwd":
        output = getPath();
        break;
      case "open":
        if (args[0] && openApp) {
          openApp(args[0]);
          output = `Opening ${args[0]}...`;
        } else {
          output = "Usage: open <app>";
        }
        break;
      case "minimize":
        if (args[0] && minimizeApp) {
          minimizeApp(args[0]);
          output = `Minimizing ${args[0]}...`;
        } else {
          output = "Usage: minimize <app>";
        }
        break;
      case "about":
        output = "webOS Simulator - Desarrollador Full Stack, React + TS + Tailwind, UI futurista";
        break;
      case "date":
        output = new Date().toLocaleString();
        break;
      default:
        output = `${cmd}: comando no reconocido`;
    }

    setHistory([...history, { input, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(commandInput);
      setCommandInput("");
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  return (
    <div className="bg-black text-green-400 font-mono p-4 rounded-lg shadow-md absolute top-4 left-1/2 -translate-x-1/2 w-11/12 md:w-3/4 lg:w-2/3 z-50 max-h-[70vh] overflow-y-auto">
      {/* <div className="flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
      </div> */}
      <div className="space-y-1">
        {history.map((c, idx) => (
          <div key={idx}>
            <p className="text-sm">
              <span className="text-green-300">user@webOS:</span>
              <span className="text-green-400">{getPath()}$</span> {c.input}
            </p>
            <p className="text-sm">{c.output}</p>
          </div>
        ))}
        <div className="flex gap-2">
          <span className="text-green-300">user@webOS:</span>
          <span className="text-green-400">{getPath()}$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-black text-green-400 focus:outline-none flex-1"
            ref={inputRef}
          />
          <span className="animate-pulse">█</span>
        </div>
      </div>
    </div>
  );
}
