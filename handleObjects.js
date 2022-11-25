const fs = require('fs');
console.log('handle load');
let planTeste = __dirname + '/todosHid.csv';
let planComp = __dirname + '/todos hidrantes.csv';

// geojson._layers[50].feature.properties.NOME_DIST;

class HandleObjects{
	//constructor(url = planTeste){
	constructor(url = planComp){
		this.local = url;
		this.objects = this.loadObjects();

	}

	loadObjects(){
		let labels = [];
		let objs = []
		let numberTypeColumn = ['id', 'lat', 'long'];
		let letters = [];
		let lettersByteCode = [];

		fs.open(this.local, 'rs+', function (err, f) {
			let csvString = fs.readFileSync(f,'utf-8');

		    //csvString = csvString.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase(); // linha extra

		    normalize(csvString).then(stringToArrayOfObjects);
		    

		});
		  
		async function normalize(string){
		  	
		  	return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase(); // linha extra
		}

		function stringToArrayOfObjects(string){
		  	let lines = string.split('\n');
		    labels = lines[0].replaceAll('\r', '').split(';');
		    

		    labels = labels.map((label) => {
		    	return label.toLowerCase();
		    });

		    for(let i = 1;i < lines.length; i++){
		    //for(let i = 3;i < 4; i++){
		      let line = lines[i].replaceAll('\r', '').split(';');
		      let obj = {};

		      for(let o = 0;o < labels.length;o++){
		      	let a = (numberTypeColumn.indexOf(labels[o]) != -1)?parseFloat(line[o]):line[o];

	        	obj[labels[o]] = a;
		      }
		      //objs[parseFloat(line[0])] = obj;
		      objs.push(obj);
		  	}
		  }


	  this.labels = labels;
	  return objs;
	}
}

module.exports.HandleObjects = HandleObjects;