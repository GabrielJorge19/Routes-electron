const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    loadObjects: () => ipcRenderer.send('getObjects'),
    on: (channel, callback) => {
      	const newCallback = (_, data) => callback(data);
       	ipcRenderer.on(channel, newCallback);
	},
    objects: 'some data',
})