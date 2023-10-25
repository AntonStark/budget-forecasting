const { contextBridge, ipcRenderer } = require('electron')


window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})


contextBridge.exposeInMainWorld('data', {
    getAll: () => ipcRenderer.invoke('get-all-data'),
})

contextBridge.exposeInMainWorld('gui', {
    displayCheckpointWindow: () => ipcRenderer.send('display-checkpoint'),
})
