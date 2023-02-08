const {
  BrowserWindow,
  app,
  ipcMain,
  Notification,
  dialog,
} = require("electron");
const path = require("path");
const { exit } = require("process");
const ipc = ipcMain;

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 940,
    minHeight: 560, 
    //comment out for dev tools
  /*   frame: false, */
    icon: __dirname + "./src/assets/images/logo.png",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  ipc.on("minApp", () => {
    console.log("Clicked on Min Btn");
    win.minimize();
  });

  ipc.on("closeApp", () => {
    console.log("Clicked on Close Btn");
    win.close();
    app.quit();
  });

  ipc.on("maxApp", () => {
    if (win.isMaximized()) {
      console.log("Clicked on Restore");
      win.restore();
    } else {
      console.log("Clicked on Maximize");
      win.maximize();
    }
  });

  ipc.on("enterFullscreen", () =>{
    win.setFullScreen(true);
  })

  ipc.on("leaveFullscreen", () =>{
    win.setFullScreen(false);
  })

  ipc.handle("selectDirectory", async (event, message) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });
    if (canceled) {
      return;
    } else {
      return filePaths[0];
    }
  });
  ipc.on("deleteVideo", (event, data) => {
    dialog.showMessageBox(
      win,
      {
        type: "question",
        buttons: ["Yes", "No"],
        title: "Delete Video",
        message: "Do you really want to delete this Video?",
      },
      (response) => {
        if (response == "Yes") {
          console.log("1");
        }
        if (response == 0) {
          console.log("0");
        }
        if (response == 2) {
          console.log("2");
        }
      }
    );
  });

  // check if is maximized
  win.on("maximize", () => {
    win.webContents.send("isMaximized");
  });
  // check if is restored
  win.on("unmaximize", () => {
    win.webContents.send("isRestored");
  });
}

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

//example
ipc.on("notify", (_, message) => {
  new Notification({ title: "Notifiation", body: message }).show();
});

app.whenReady().then(createWindow);
