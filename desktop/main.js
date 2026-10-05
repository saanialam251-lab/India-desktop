// Desktop shell for the India 2027 Squad Lab web app (same code as the Android app).
// The built web app (Vite "dist") is copied into ./app and served through a private app:// address,
// because browsers refuse to run module scripts from plain file:// pages.
const { app, BrowserWindow, protocol, net, shell, Menu } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { standard: true, secure: true, supportFetchAPI: true } }]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 360, minHeight: 600,
    backgroundColor: "#050d1f", title: "India 2027 Squad Lab", autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  // Links that leave the app (Gmail, mailto:) open in the normal browser / mail app.
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => { if (!url.startsWith("app://")) { e.preventDefault(); shell.openExternal(url); } });
  win.loadURL("app://squad/index.html");
}

app.whenReady().then(() => {
  const root = path.join(__dirname, "app");
  protocol.handle("app", req => {
    let p = decodeURIComponent(new URL(req.url).pathname);
    if (p === "/" || p === "") p = "/index.html";
    const file = path.normalize(path.join(root, p));
    if (!file.startsWith(root)) return new Response("Not found", { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
  Menu.setApplicationMenu(null);
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
