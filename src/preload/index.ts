import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { ElectronAPI } from "../types/electron";

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
  listTextFiles: (folderPath: string) =>
    ipcRenderer.invoke("folder:listTextFiles", folderPath),
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
};

contextBridge.exposeInMainWorld("electronAPI", api);
