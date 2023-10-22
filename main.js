const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


ipcMain.handle('get-all-data', async () => {
    return {
        dates: ['2023-10-11', '2023-10-12', '2023-10-13', '2023-10-15'],
        accounts: [
            {
                name: 'rub',
                balances: [100, 90, 70, 60],
            },
            {
                name: 'usd',
                balances: [50, 48, 45, 44],
            }
        ]
    }
})
