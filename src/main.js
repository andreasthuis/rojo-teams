const { app, ipcMain, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

if (process.platform === "linux") {
  app.commandLine.appendSwitch("enable-transparent-visuals");
  app.disableHardwareAcceleration();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 720,
    height: 500,
    frame: false,
    transparent: true,
    resizable: true,
    hasShadow: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:maximized');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:unmaximized');
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("window:close", (event) => {
  BrowserWindow.fromWebContents(event.sender).close();
});

ipcMain.on("window:minimize", (event) => {
  BrowserWindow.fromWebContents(event.sender).minimize();
});

ipcMain.on("window:maximize", (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

ipcMain.handle("menus:get", () => {
  const appPath = app.getAppPath();

  const menusPath = path.join(appPath, "src", "menus");

  if (!fs.existsSync(menusPath)) {
    console.error("Menus folder not found:", menusPath);
    return [];
  }

  return fs.readdirSync(menusPath).filter((f) => f.endsWith(".html"));
});

ipcMain.handle("menus:load", (_, file) => {
  const appPath = app.getAppPath();
  const menusPath = path.join(appPath, "src", "menus", file);

  if (!fs.existsSync(menusPath)) {
    throw new Error("Menu file not found: " + file);
  }

  return fs.readFileSync(menusPath, "utf8");
});