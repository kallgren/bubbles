export interface Settings {
  autoAdvance: boolean;
  archiveFolderName: string;
}

export interface ElectronAPI {
  onToggleSidebar: (callback: () => void) => () => void;
  onMenuOpenFolder: (callback: () => void) => () => void;
  onInitialFolder: (callback: () => void) => void;
  openFolder: () => Promise<string | undefined>;
  getFiles: (folderPath: string) => Promise<{
    activeFiles: string[];
    archivedFiles: string[];
  }>;
  createNewFile: (folderPath: string) => Promise<string | null>;
  onMenuNewFile: (callback: () => void) => () => void;
  readFile: (folderPath: string, filename: string) => Promise<string | null>;
  deleteFile: (folderPath: string, filename: string) => Promise<boolean>;
  onMenuDeleteFile: (callback: () => void) => () => void;
  archiveFile: (
    folderPath: string,
    filename: string,
    isRestore: boolean
  ) => Promise<boolean>;
  onMenuArchiveFile: (callback: () => void) => () => void;
  onMenuRestoreFile: (callback: () => void) => () => void;
  updateMenuEnabled: (menuId: string, enabled: boolean) => Promise<void>;
  onMenuCloseFile: (callback: () => void) => () => void;
  getSettings: () => Promise<Settings>;
  saveSettings: (settings: Settings) => Promise<boolean>;
  openSettings: () => Promise<void>;
  onMenuOpenSettings: (callback: () => void) => () => void;
  onMenuFirstItem: (callback: () => void) => () => void;
  onMenuPreviousItem: (callback: () => void) => () => void;
  onMenuNextItem: (callback: () => void) => () => void;
  onMenuLastItem: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
