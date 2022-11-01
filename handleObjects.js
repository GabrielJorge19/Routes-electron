const fs = require('fs');
console.log('handle load');
let planTeste = __dirname + '/todosHid.csv';
let planComp = __dirname + '/todos hidrantes.csv';

// geojson._layers[50].feature.properties.NOME_DIST;

class HandleObjects{
	constructor(url = planTeste){
		this.local = url;
		this.objects = this.loadObjects();

	}
	loadObjects(){
	  let labels = [];
	  let objs = {}
	  let numberTypeColumn = ['id', 'lat', 'long'];

	  fs.open(this.local, 'rs+', function (err, f) {
	    let csvString = fs.readFileSync(f,'utf8');

	    let lines = csvString.split('\n');
	    labels = lines[0].replaceAll('\r', '').split(';');
	    

	    labels = labels.map((label) => {
	    	return label.toLowerCase();
	    });

	    for(let i = 1;i < lines.length; i++){
	      let line = lines[i].replaceAll('\r', '').split(';');
	      let obj = {};

	      for(let o = 0;o < labels.length;o++){
	      	let a = (numberTypeColumn.indexOf(labels[o]) != -1)?parseFloat(line[o]):line[o].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        	obj[labels[o]] = a;
	      }
	      objs[parseFloat(line[0])] = obj;
	    }
	  });

	  this.labels = labels;
	  return objs;
	}
}

module.exports.HandleObjects = HandleObjects;