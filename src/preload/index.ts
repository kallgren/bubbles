const { contextBridge, ipcRenderer } = require("electron");
import { IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
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
  openFolder: () => ipcRenderer.invoke("dialog:openFolder"),
  listTextFiles: (folderPath: string) =>
    ipcRenderer.invoke("folder:listTextFiles", folderPath),
});
