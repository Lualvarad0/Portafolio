export interface Project {
  id: string;
  name: string;
  description: string | null;
  language: string;
  stack: string;
  url: string;
  pushedAt: string;
}

export const projects: Project[] = [
  {
    id: "angular-countries",
    name: "Angular-countries",
    description:
      "App Angular 14 para explorar países del mundo — dashboard de estadísticas, buscador con filtros por región, favoritos y perfil de usuario. REST Countries API v3.1.",
    language: "TypeScript",
    stack: "Angular 14 · REST Countries API · Tailwind CSS · SPA",
    url: "https://github.com/Lualvarad0/Angular-countries",
    pushedAt: "2026-04-23",
  },
  {
    id: "sistema-gestion",
    name: "Sistema-Gestion-Interna",
    description:
      "Sistema de gestión interna para la Gobernación del Guayas — colegios, luminarias CNEL, encuentros ciudadanos, trabajadores y roles de usuario.",
    language: "PHP",
    stack: "PHP MVC · Bootstrap · MariaDB · MySQL",
    url: "https://github.com/Lualvarad0/Sistema-Gestion-Interna",
    pushedAt: "2026-04-22",
  },
  {
    id: "javaquiz",
    name: "javaQuiz-zustand",
    description:
      "Quiz interactivo de JavaScript con React (TS) + Zustand para gestión de estado, UI con MUI y bundled con Vite 6.",
    language: "TypeScript",
    stack: "React · Zustand · MUI · Vite",
    url: "https://github.com/Lualvarad0/javaQuiz-zustand",
    pushedAt: "2025-05-14",
  },
  {
    id: "fullstack-project",
    name: "Full-stack-project",
    description: "Ingreso y gestión de facturas — aplicación fullstack TypeScript.",
    language: "TypeScript",
    stack: "TypeScript · Node.js · Fullstack",
    url: "https://github.com/Lualvarad0/Full-stack-project",
    pushedAt: "2024-11-07",
  },
  {
    id: "microservice-b2b",
    name: "Microservice-B2b",
    description:
      "Arquitectura de microservicios B2B con comunicación entre servicios, autenticación y API Gateway.",
    language: "JavaScript",
    stack: "Node.js · Microservices · B2B",
    url: "https://github.com/Lualvarad0/Microservice-B2b",
    pushedAt: "2026-03-13",
  },
  {
    id: "csharp",
    name: "C-.net",
    description:
      "Código y ejercicios en C# con .NET. Backend development, APIs y fundamentos de la plataforma Microsoft.",
    language: "C#",
    stack: "C# · .NET · Backend · REST APIs",
    url: "https://github.com/Lualvarad0/C-.net",
    pushedAt: "2023-03-15",
  },
];
