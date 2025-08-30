export const getPathFromRoute = (pathname: string) => {
  switch (pathname) {
    case "/": return "~/inicio";
    case "/sobre-mi": return "~/sobre-mi";
    case "/servicios": return "~/servicios";
    case "/habilidades": return "~/habilidades";
    case "/contacto": return "~/contacto";
    default: return "~/";
  }
};
