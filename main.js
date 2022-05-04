const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function handleSetTitle(event, title) {
    // const webContents = event.sender;

    // const win = BrowserWindow.fromWebContents(webContents);
    // win.setTitle(title);

    BrowserWindow.fromWebContents(event.sender)
        .setTitle(title);
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows.length === 0) {
            createWindow();
        }
    });

    ipcMain.on('set-title', handleSetTitle);
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
})