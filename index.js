const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const handleObjects = require('./handleObjects.js');



const ho = new handleObjects.HandleObjects();


const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: __dirname +  '/preload.js',
    }
  })

  win.loadFile('./Router V6/index.html');
  win.maximize();
}

app.on('ready', () => {
	createWindow();
});










ipcMain.on('getObjects', (event, arg) => {
  console.log('Enviando objetos');
  event.reply('objects', JSON.stringify(ho.objects));
})
