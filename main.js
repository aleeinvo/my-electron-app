const { app, BrowserWindow, Menu, ipcMain, dialog, desktopCapturer, screen } = require('electron');
const path = require('path');
const fs = require('fs');

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

function captureScreen() {
    desktopCapturer.getSources(
        {
            types: ['window', 'screen'],
            thumbnailSize: screen.getPrimaryDisplay().workAreaSize
        }
    ).then(async sources => {
        const entireScreen = sources.find(source => {
            return source.name == 'Entire Screen';
        });

        const imageContents = Buffer.from(entireScreen.thumbnail.toPNG(), 'base64');

        const captureDir = path.join(__dirname, 'captures');

        if(!fs.existsSync(captureDir)) {
            fs.mkdirSync(captureDir);
        }
        fs.writeFile(path.join(__dirname, `captures/${Date.now()}.png`), imageContents, error => {
            if (error) {
                console.log(error.message);
                return;
            }

            console.log('screen shot taken successfully');
        });
    });
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () => win.webContents.send('plus-counter'),
                    label: 'Increment +'
                },
                {
                    click: () => win.webContents.send('minus-counter'),
                    label: 'Decrement -'
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);

    win.loadFile('index.html');

    // const sandboxed = new BrowserWindow({
    //     width: 800,
    //     height: 600,
    //     webPreferences: {
    //         sandbox: true
    //     }
    // });

    // sandboxed.loadURL('https://github.com');
}

// app.enableSandbox();

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen);

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows.length === 0) {
            createWindow();
        }
    });

    ipcMain.on('set-title', handleSetTitle);
    ipcMain.on('counter-value', (_event, value) => {
        console.log('Counter Value:', value);
    });

    setInterval(captureScreen, 10000);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})