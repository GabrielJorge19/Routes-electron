//window.electronAPI.setTitle('title');

let objects;

window.electronAPI.on('objects', (res) => {
  console.log('Objetos carregados');
  objects = JSON.parse(res);
})


window.electronAPI.loadObjects();


