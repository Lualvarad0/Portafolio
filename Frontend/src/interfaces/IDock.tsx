export interface DockProps {
  setActiveWindow: (windowName: string) => void;
  minimized: string[]; // <- aquí se define minimized
}
