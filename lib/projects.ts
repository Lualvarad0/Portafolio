// Structural project data. Titles, tags and descriptions are translated in messages/*.json
// under projects.items.<id>. The first project is shown as the featured (yellow) card.
export interface Project {
  id: string;
  repo: string;
  language: string;
  stack: string;
  url: string;
}

export const projects: Project[] = [
  {
    id: "sistema-gestion",
    repo: "Sistema-Gestion-Interna",
    language: "PHP",
    stack: "PHP MVC · Bootstrap · MariaDB",
    url: "https://github.com/Lualvarad0/Sistema-Gestion-Interna",
  },
  {
    id: "microservice-b2b",
    repo: "Microservice-B2b",
    language: "JavaScript",
    stack: "Node.js · Microservicios · API Gateway",
    url: "https://github.com/Lualvarad0/Microservice-B2b",
  },
  {
    id: "fullstack-project",
    repo: "Full-stack-project",
    language: "TypeScript",
    stack: "TypeScript · Node.js",
    url: "https://github.com/Lualvarad0/Full-stack-project",
  },
  {
    id: "angular-countries",
    repo: "Angular-countries",
    language: "TypeScript",
    stack: "Angular · REST Countries API · Tailwind",
    url: "https://github.com/Lualvarad0/Angular-countries",
  },
  {
    id: "javaquiz",
    repo: "javaQuiz-zustand",
    language: "TypeScript",
    stack: "React · Zustand · MUI · Vite",
    url: "https://github.com/Lualvarad0/javaQuiz-zustand",
  },
  {
    id: "csharp",
    repo: "C-.net",
    language: "C#",
    stack: "C# · .NET · REST APIs",
    url: "https://github.com/Lualvarad0/C-.net",
  },
];
