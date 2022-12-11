const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  //example
  notificationApi: {
    sendNotification(message) {
      console.log(message);
      ipcRenderer.send("notify", message);
    },
  },
  minApp: {
    min() {
      ipcRenderer.send("minApp");
    },
  },

  maxApp: {
    max() {
      ipcRenderer.send("maxApp");
    },
  },

  closeApp: {
    close() {
      ipcRenderer.send("closeApp");
    },
  },
  selectFolder: () => ipcRenderer.invoke("selectDirectory"),
});
