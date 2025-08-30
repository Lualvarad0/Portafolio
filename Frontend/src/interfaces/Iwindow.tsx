export interface IWindow {
  title: string;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  position?: { top?: number; left?: number };
  children: React.ReactNode;
}
