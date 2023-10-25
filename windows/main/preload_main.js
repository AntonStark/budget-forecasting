const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('data', {
    getAll: () => ipcRenderer.invoke('get-all-data'),
})

contextBridge.exposeInMainWorld('gui', {
    displayCheckpointWindow: () => ipcRenderer.send('display-checkpoint'),
})
