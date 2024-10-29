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
import { readdir, readFile, writeFile } from "fs/promises";
import { format } from "date-fns";

async function getLastFolder(): Promise<string | undefined> {
  const configPath = path.join(app.getPath("userData"), "config.json");
  try {
    const config = JSON.parse(await readFile(configPath, "utf-8"));
    return config.lastFolder;
  } catch {
    return undefined;
  }
}

async function saveLastFolder(folderPath: string) {
  const configPath = path.join(app.getPath("userData"), "config.json");
  await writeFile(configPath, JSON.stringify({ lastFolder: folderPath }));
}

async function handleFolderOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (!canceled) {
    await saveLastFolder(filePaths[0]);
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

async function handleCreateNewFile(
  event: IpcMainInvokeEvent,
  folderPath: string
) {
  const timestamp = format(new Date(), "yyyy-MM-dd (HHmmss)");
  const filename = `${timestamp}.txt`;
  const filePath = path.join(folderPath, filename);

  try {
    await writeFile(filePath, "");
    return filename;
  } catch (error) {
    console.error("Failed to create file:", error);
    return null;
  }
}

async function createWindow() {
  const lastFolder = await getLastFolder();

  const folderPath = lastFolder || (await handleFolderOpen());

  if (!folderPath) {
    app.quit();
    return;
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload/index.js"),
    },
  });

  ipcMain.handle("dialog:openFolder", handleFolderOpen);
  ipcMain.handle("folder:listTextFiles", handleListTextFiles);
  ipcMain.handle("file:create", handleCreateNewFile);

  createMenu(win);

  if (isDev) {
    await win.loadURL(
      `http://localhost:5173?folder=${encodeURIComponent(folderPath)}`
    );
    // win.webContents.openDevTools();
  } else {
    await win.loadFile(path.join(__dirname, "../renderer/index.html"), {
      query: { folder: folderPath },
    });
  }

  win.show();
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
