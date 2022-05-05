const { contextBridge, ipcRenderer } = require('electron');
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);

        if(element) {
            element.innerText = text;
        }
    }

    for(const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});

contextBridge.exposeInMainWorld('electronAPI', {
    city: 'Lahore',
    setTitle: (title) => ipcRenderer.send('set-title', title),
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    onPlusCounter: (callback) => ipcRenderer.on('plus-counter', callback),
    onMinusCounter: (callback) => ipcRenderer.on('minus-counter', callback)
});