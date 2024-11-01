import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainInvokeEvent,
  shell,
  Menu,
} from "electron";
import path from "path";
import isDev from "electron-is-dev";
import { createMenu } from "./menu";
import { readdir, readFile, writeFile, mkdir, rename, stat } from "fs/promises";
import { format } from "date-fns";
import fs from "fs/promises";
import { DEFAULT_SETTINGS } from "../config";
import { Settings } from "../types/electron";

// Define the NodeJS error type locally
interface NodeJSError extends Error {
  code?: string;
}

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

async function handleGetFiles(event: IpcMainInvokeEvent, folderPath: string) {
  try {
    const settings = await handleGetSettings();
    const mainFiles = await readdir(folderPath);
    const archivePath = path.join(folderPath, settings.archiveFolderName);
    let archiveFiles: string[] = [];

    try {
      archiveFiles = (await readdir(archivePath))
        .filter((f) => f.endsWith(".txt"))
        .map((f) => `${settings.archiveFolderName}/${f}`);
    } catch (error) {
      // Archive folder might not exist yet
    }

    const allFiles = [
      ...mainFiles.filter((f) => f.endsWith(".txt")),
      ...archiveFiles,
    ];

    const fileStats = await Promise.all(
      allFiles.map(async (file) => ({
        name: file,
        birthtime: (await stat(path.join(folderPath, file))).birthtime,
      }))
    );

    return {
      activeFiles: fileStats
        .filter((f) => !f.name.startsWith(`${settings.archiveFolderName}/`))
        .sort((a, b) => b.birthtime.getTime() - a.birthtime.getTime())
        .map((f) => f.name),
      archivedFiles: fileStats
        .filter((f) => f.name.startsWith(`${settings.archiveFolderName}/`))
        .sort((a, b) => b.birthtime.getTime() - a.birthtime.getTime())
        .map((f) => f.name),
    };
  } catch (error) {
    console.error("Failed to read directory:", error);
    return { activeFiles: [], archivedFiles: [] };
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

async function handleReadFile(
  event: IpcMainInvokeEvent,
  folderPath: string,
  filename: string
) {
  const fullPath = path.join(folderPath, filename);
  try {
    const content = await readFile(fullPath, "utf-8");
    return content;
  } catch (error) {
    console.error("Failed to read file:", error);
    return null;
  }
}

async function handleDeleteFile(
  event: IpcMainInvokeEvent,
  folderPath: string,
  filename: string
) {
  const { response } = await dialog.showMessageBox({
    type: "warning",
    message: "Move to trash?",
    detail: `Are you sure you want to move "${filename}" to trash?`,
    buttons: ["Cancel", "Move to Trash"],
    defaultId: 0,
    cancelId: 0,
  });

  if (response === 1) {
    const fullPath = path.join(folderPath, filename);
    try {
      await shell.trashItem(fullPath);
      return true;
    } catch (error) {
      console.error("Failed to move file to trash:", error);
      return false;
    }
  }
  return false;
}

async function handleArchiveFile(
  event: IpcMainInvokeEvent,
  folderPath: string,
  filename: string,
  isRestore: boolean
) {
  try {
    const settings = await handleGetSettings();
    const archivePath = path.join(folderPath, settings.archiveFolderName);

    if (!isRestore) {
      try {
        await mkdir(archivePath, { recursive: true });
      } catch (error) {
        const nodeError = error as NodeJSError;
        if (nodeError.code !== "EEXIST") throw error;
      }
    }

    const sourcePath = path.join(
      folderPath,
      isRestore ? settings.archiveFolderName : "",
      filename
    );
    const targetPath = path.join(
      folderPath,
      isRestore ? "" : settings.archiveFolderName,
      filename
    );

    await rename(sourcePath, targetPath);
    return true;
  } catch (error) {
    console.error("Failed to archive/restore file:", error);
    return false;
  }
}

async function handleGetSettings() {
  try {
    const settingsPath = path.join(app.getPath("userData"), "settings.json");
    const settings = await fs.readFile(settingsPath, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(settings) };
  } catch (error) {
    const nodeError = error as NodeJSError;
    if (nodeError.code === "ENOENT") {
      console.log("No settings file found, using defaults");
    } else {
      console.error("Failed to load settings:", error);
    }
    return DEFAULT_SETTINGS;
  }
}

async function handleSaveSettings(
  event: IpcMainInvokeEvent,
  settings: Settings
) {
  try {
    if (!settings || typeof settings !== "object") {
      throw new Error("Invalid settings object");
    }

    const validatedSettings: Settings = {
      autoAdvance: Boolean(settings.autoAdvance),
      archiveFolderName: String(
        settings.archiveFolderName || DEFAULT_SETTINGS.archiveFolderName
      ),
    };

    const settingsPath = path.join(app.getPath("userData"), "settings.json");
    await fs.writeFile(
      settingsPath,
      JSON.stringify(validatedSettings),
      "utf-8"
    );
    return true;
  } catch (error) {
    console.error("Failed to save settings:", error);
    return false;
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
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 18, y: 18 },
    vibrancy: "sidebar",
    backgroundColor: "#00ffffff",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload/index.js"),
    },
  });

  ipcMain.handle("dialog:openFolder", handleFolderOpen);
  ipcMain.handle("folder:getFiles", handleGetFiles);
  ipcMain.handle("file:create", handleCreateNewFile);
  ipcMain.handle("file:read", handleReadFile);
  ipcMain.handle("file:delete", handleDeleteFile);
  ipcMain.handle("file:archive", handleArchiveFile);

  ipcMain.handle(
    "menu:updateEnabled",
    (event, menuId: string, enabled: boolean) => {
      const menu = Menu.getApplicationMenu();
      if (!menu) return;

      // Search through all menus for the item
      for (const topMenu of menu.items) {
        const menuItem = topMenu.submenu?.items.find(
          (item) => item.label === menuId
        );
        if (menuItem) {
          menuItem.enabled = enabled;
          break;
        }
      }
    }
  );

  ipcMain.handle("settings:get", handleGetSettings);
  ipcMain.handle("settings:save", handleSaveSettings);

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
