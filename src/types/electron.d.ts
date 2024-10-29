export interface ElectronAPI {
  onToggleSidebar: (callback: () => void) => () => void;
  onMenuOpenFolder: (callback: () => void) => () => void;
  onInitialFolder: (callback: () => void) => void;
  openFolder: () => Promise<string | undefined>;
  listTextFiles: (folderPath: string) => Promise<string[]>;
  createNewFile: (folderPath: string) => Promise<string | null>;
  onMenuNewFile: (callback: () => void) => () => void;
  readFile: (folderPath: string, filename: string) => Promise<string | null>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
