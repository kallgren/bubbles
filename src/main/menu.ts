import { app, Menu, BrowserWindow } from "electron";

export function createMenu(mainWindow: BrowserWindow) {
  const isMac = process.platform === "darwin";

  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" as const },
              { type: "separator" as const },
              {
                label: "Settings...",
                accelerator: "Cmd+,",
                click: () => {
                  mainWindow.webContents.send("menu-open-settings");
                },
              },
              { type: "separator" as const },
              { role: "services" as const },
              { type: "separator" as const },
              { role: "hide" as const },
              { role: "hideOthers" as const },
              { role: "unhide" as const },
              { type: "separator" as const },
              { role: "quit" as const },
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [
        {
          label: "New File",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.send("menu-new-file");
          },
        },
        { type: "separator" as const },
        {
          label: "Open Folder...",
          accelerator: "CmdOrCtrl+O",
          click: () => {
            mainWindow.webContents.send("menu-open-folder");
          },
        },
        { type: "separator" as const },
        {
          label: "Archive File",
          accelerator: "CmdOrCtrl+E",
          click: () => {
            mainWindow.webContents.send("menu-archive-file");
          },
          enabled: false,
        },
        {
          label: "Restore File",
          accelerator: "CmdOrCtrl+Shift+E",
          click: () => {
            mainWindow.webContents.send("menu-restore-file");
          },
          enabled: false,
        },
        {
          label: "Delete File",
          accelerator: "CmdOrCtrl+Backspace",
          click: () => {
            mainWindow.webContents.send("menu-delete-file");
          },
          enabled: false,
        },
        {
          label: "Close File",
          accelerator: "CmdOrCtrl+W",
          click: () => {
            mainWindow.webContents.send("menu-close-file");
          },
          enabled: false,
        },
        isMac ? { role: "close" as const } : { role: "quit" as const },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" as const },
        { role: "redo" as const },
        { type: "separator" as const },
        { role: "cut" as const },
        { role: "copy" as const },
        { role: "paste" as const },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" as const },
              { role: "delete" as const },
              { role: "selectAll" as const },
            ]
          : [
              { role: "delete" as const },
              { type: "separator" as const },
              { role: "selectAll" as const },
            ]),
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        {
          label: "Toggle Sidebar",
          accelerator: isMac ? "Cmd+S" : "Ctrl+S",
          click: () => {
            mainWindow.webContents.send("toggle-sidebar");
          },
        },
        { type: "separator" },
        { role: "toggleDevTools" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" as const },
        { role: "zoom" as const },
        ...(isMac
          ? [{ type: "separator" as const }, { role: "front" as const }]
          : []),
      ],
    },
    {
      label: "Navigate",
      submenu: [
        {
          label: "Newest Bubble",
          accelerator: "CmdOrCtrl+Shift+B",
          enabled: false,
          click: () => {
            mainWindow.webContents.send("menu-first-item");
          },
        },
        {
          label: "Older Bubble",
          accelerator: "CmdOrCtrl+J",
          enabled: false,
          click: () => {
            mainWindow.webContents.send("menu-previous-item");
          },
        },
        {
          label: "Newer Bubble",
          accelerator: "CmdOrCtrl+K",
          enabled: false,
          click: () => {
            mainWindow.webContents.send("menu-next-item");
          },
        },
        {
          label: "Oldest Bubble",
          accelerator: "CmdOrCtrl+Shift+O",
          enabled: false,
          click: () => {
            mainWindow.webContents.send("menu-last-item");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
