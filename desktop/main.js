// Desktop shell for the India 2027 Squad Lab web app.
// The built web app (Vite "dist") is copied into ./app and served through a private app:// address,
// because browsers refuse to run module scripts from plain file:// pages.
const { app, BrowserWindow, protocol, shell, Menu, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

const LOG = () => path.join(app.getPath("userData"), "error.log");
const log = (...a) => { try { fs.appendFileSync(LOG(), `[${new Date().toISOString()}] ${a.join(" ")}\n`); } catch {} };

// Any crash is written to a log file and shown in a readable message instead of a Windows crash box.
process.on("uncaughtException", e => {
  log("uncaughtException", (e && e.stack) || e);
  try { dialog.showErrorBox("India 2027 Squad Lab", `Something went wrong:\n${e && e.message}\n\nDetails saved in:\n${LOG()}`); } catch {}
});

// "--safe" turns off graphics-card acceleration (fixes crashes on some Windows PCs / virtual machines).
if (process.argv.includes("--safe")) app.disableHardwareAcceleration();
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { standard: true, secure: true, supportFetchAPI: true } }]);

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".map": "application/json", ".txt": "text/plain" };

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 360, minHeight: 600,
    backgroundColor: "#050d1f", title: "India 2027 Squad Lab", autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  // Links that leave the app (Gmail, mailto:) open in the normal browser / mail app.
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => { if (!url.startsWith("app://")) { e.preventDefault(); shell.openExternal(url); } });
  win.webContents.on("did-fail-load", (_e, code, desc, url) => log("did-fail-load", code, desc, url));
  win.webContents.on("render-process-gone", (_e, d) => { log("render-process-gone", d.reason); if (win && !win.isDestroyed()) win.reload(); });
  win.on("closed", () => { win = null; });
  win.loadURL("app://squad/index.html");
}

app.on("second-instance", () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.on("child-process-gone", (_e, d) => {
  log("child-process-gone", d.type, d.reason);
  if (d.type === "GPU" && !process.argv.includes("--safe")) { app.relaunch({ args: process.argv.slice(1).concat("--safe") }); app.exit(0); }
});

app.whenReady().then(() => {
  const root = path.join(__dirname, "app");
  protocol.handle("app", req => {
    try {
      let p = decodeURIComponent(new URL(req.url).pathname);
      if (p === "/" || p === "") p = "/index.html";
      const file = path.normalize(path.join(root, p));
      if (!file.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });
      const data = fs.readFileSync(file);   // works inside the packed app.asar too
      return new Response(data, { headers: { "content-type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" } });
    } catch (e) { log("serve failed", req.url, e.message); return new Response("Not found", { status: 404 }); }
  });
  Menu.setApplicationMenu(null);
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
