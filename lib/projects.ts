// Structural project data. Titles, tags and descriptions are translated in messages/*.json
// under projects.items.<id>. The first project is shown as the featured (yellow) card.
export interface Project {
  id: string;
  name: string;
  host: string;
  url: string;
  // Screenshot of the live site (1440×900) in public/projects/
  image: string;
}

export const projects: Project[] = [
  {
    id: "nudo",
    name: "Nudo",
    host: "nudo.alvarado-dev.com",
    url: "https://nudo.alvarado-dev.com/",
    image: "/projects/nudo.png",
  },
  {
    id: "unisono",
    name: "Unísono",
    host: "app-alabanzas.web.app",
    url: "https://app-alabanzas.web.app/",
    image: "/projects/unisono.png",
  },
];
