import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainInvokeEvent,
} from "electron";
import path from "path";
import isDev from "electron-is-dev";
import { createMenu } from "./menu";
import { readdir } from "fs/promises";

async function handleFolderOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (!canceled) {
    return filePaths[0];
  }
}

async function handleListTextFiles(
  event: IpcMainInvokeEvent,
  folderPath: string
) {
  try {
    const files = await readdir(folderPath);
    return files.filter((file) => file.endsWith(".txt"));
  } catch (error) {
    console.error("Failed to read directory:", error);
    return [];
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload/index.js"),
    },
  });

  ipcMain.handle("dialog:openFolder", handleFolderOpen);
  ipcMain.handle("folder:listTextFiles", handleListTextFiles);

  createMenu(win);

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
