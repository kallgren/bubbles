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
});
