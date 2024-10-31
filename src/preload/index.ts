import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { ElectronAPI, Settings } from "../types/electron";

const api: ElectronAPI = {
  onToggleSidebar: (
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => {
    ipcRenderer.on("toggle-sidebar", callback);
    return () => {
      ipcRenderer.removeListener("toggle-sidebar", callback);
    };
  },
  onMenuOpenFolder: (callback: () => void) => {
    ipcRenderer.on("menu-open-folder", callback);
    return () => {
      ipcRenderer.removeListener("menu-open-folder", callback);
    };
  },
  onInitialFolder: (
    callback: (event: IpcRendererEvent, path: string) => void
  ) => {
    ipcRenderer.on("set-initial-folder", callback);
    return () => {
      ipcRenderer.removeListener("set-initial-folder", callback);
    };
  },
  openFolder: () => ipcRenderer.invoke("dialog:openFolder"),
  getFiles: (folderPath: string) =>
    ipcRenderer.invoke("folder:getFiles", folderPath),
  createNewFile: (folderPath: string) =>
    ipcRenderer.invoke("file:create", folderPath),
  onMenuNewFile: (callback: () => void) => {
    ipcRenderer.on("menu-new-file", callback);
    return () => {
      ipcRenderer.removeListener("menu-new-file", callback);
    };
  },
  readFile: (folderPath: string, filename: string) =>
    ipcRenderer.invoke("file:read", folderPath, filename),
  deleteFile: (folderPath: string, filename: string) =>
    ipcRenderer.invoke("file:delete", folderPath, filename),
  onMenuDeleteFile: (callback: () => void) => {
    ipcRenderer.on("menu-delete-file", callback);
    return () => {
      ipcRenderer.removeListener("menu-delete-file", callback);
    };
  },
  archiveFile: (folderPath: string, filename: string, isRestore: boolean) =>
    ipcRenderer.invoke("file:archive", folderPath, filename, isRestore),
  onMenuArchiveFile: (callback: () => void) => {
    ipcRenderer.on("menu-archive-file", callback);
    return () => {
      ipcRenderer.removeListener("menu-archive-file", callback);
    };
  },
  onMenuRestoreFile: (callback: () => void) => {
    ipcRenderer.on("menu-restore-file", callback);
    return () => {
      ipcRenderer.removeListener("menu-restore-file", callback);
    };
  },
  updateMenuEnabled: (menuId: string, enabled: boolean) =>
    ipcRenderer.invoke("menu:updateEnabled", menuId, enabled),
  onMenuCloseFile: (callback: () => void) => {
    ipcRenderer.on("menu-close-file", callback);
    return () => {
      ipcRenderer.removeListener("menu-close-file", callback);
    };
  },
  getSettings: () => ipcRenderer.invoke("settings:get"),
  saveSettings: (settings: Settings) =>
    ipcRenderer.invoke("settings:save", settings),
  openSettings: () => ipcRenderer.invoke("window:openSettings"),
  onMenuOpenSettings: (callback: () => void) => {
    ipcRenderer.on("menu-open-settings", callback);
    return () => {
      ipcRenderer.removeListener("menu-open-settings", callback);
    };
  },
};

contextBridge.exposeInMainWorld("electronAPI", api);
