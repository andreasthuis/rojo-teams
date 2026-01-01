// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  closeWindow: () => ipcRenderer.send("window:close"),
  minimizeWindow: () => ipcRenderer.send("window:minimize"),
  maximizeWindow: () => ipcRenderer.send("window:maximize"),
  
  onMaximized: (callback) => ipcRenderer.on("window:maximized", () => callback()),
  onUnmaximized: (callback) => ipcRenderer.on("window:unmaximized", () => callback()),

  getMenus: () => ipcRenderer.invoke("menus:get"),
  loadMenu: (file) => ipcRenderer.invoke("menus:load", file)
});