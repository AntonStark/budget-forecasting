const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('data', {
    getAll: () => ipcRenderer.invoke('get-all-data'),
})
