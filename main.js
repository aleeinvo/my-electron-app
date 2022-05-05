const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');

function handleSetTitle(event, title) {
    // const webContents = event.sender;

    // const win = BrowserWindow.fromWebContents(webContents);
    // win.setTitle(title);

    BrowserWindow.fromWebContents(event.sender)
        .setTitle(title);
}

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog();

    if (canceled) {
        return;
    } else {
        return filePaths[0];
    }
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // const menu = Menu.buildFromTemplate({
    //     label: app.name,
    //     submenu: [
    //         {
    //             click: () => win.webContents.send('plus-counter'),
    //             label: 'Increment +'
    //         },
    //         {
    //             click: () => win.webContents.send('minus-counter'),
    //             label: 'Decrement -'
    //         }
    //     ]
    // });

    // Menu.setApplicationMenu(menu);

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen);

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows.length === 0) {
            createWindow();
        }
    });

    ipcMain.on('set-title', handleSetTitle);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})