let geo; 
let pesos = [];
pesos["distance"] = -100;
pesos["MÉDIA"] = 3;
pesos["EXCELENTE"] = 4;
pesos["FRACA"] = 2;
pesos["SECO"] = 1;
pesos["POSSIVEL DE USO"] = 3;
pesos["INOPERANTE"] = 2;
pesos["NÃO LOCALIZADO"] = 1;
pesos["lastVisit"] = 1/30;
pesos[""] = 1;



//document.getElementById('importFile-button').addEventListener('click', views[5].proccedFile);
//document.getElementById('preview').addEventListener('click', () => {
/*
document.getElementById('file').onchange = () => {
	let file = document.getElementById('file').files[0];

	readFileHere(file, (fileData) => {
		//let separador = document.getElementById('valueDivisor').value;
		
		let data = csvToArray(fileData, ";");

		let filters = [];
		for(let i = 3; i < data.labels.length;i++){
			filters.push(data.labels[i]);
		}

		data.labels.push('geoIcon');
		data.labels.push('hiden');
		data.labels.push('grupo');
		console.log(data);

		geo = new GeoQuadrantes(16, data.labels, data.data);

		setTimeout(() => {
			buildFilters(filters);
		}, 1000);
	});
};
*/   



function displayRank(lat, long, objs = geo.data){
	let r = Math.floor(Math.random()*objs.length);

	lat = -23.554899;
	long = -46.584208;

	lat = -23.581008;
	long = -46.566484;

	objs = geo.findObjsByDistance(objs, lat, long, 5);
	//console.log(objs);
	objs = objs.map((obj) => {
		return obj.obj;
	});

	objs = rankObjs(lat, long, objs);
	
	objs = objs.map((obj) => {
		return obj[1];
	});

	if(objs.length < 1000){
		//console.log('Exibindo ' + objs.length + ' objetos');
		for(let i = 0;i < objs.length;i++){
			let icon = objs[i][geo.translate('geoIcon')];

			icon = createDivIcon(objs[i][geo.translate('lat')], objs[i][geo.translate('long')], i+1).addTo(mapa);
			geo.setValue([objs[i]], ['geoIcon'], [icon]);
			geo.setValue([objs[i]], ['hiden'], [false]);
		} 
	} else {
		console.log('Impossivel exibir mais de 200 objetos');
	}

	findLocation(-23.581008, -46.566484);
}
 

function rankObjs(lat, long, objs){
	// ultima manutenção bsg, ultima visita, TIPO, VAZAO, SITUACAO
	let ordedObjs = [];

	for(let i = 0;i < objs.length;i++){
		let obj = objs[i];
		let distance = pesos['distance'] * geo.calculateDistance([lat, long], [obj[geo.translate('lat')], obj[geo.translate('long')]]);
		let vazao = pesos[obj[geo.translate("VAZAO")]];
		let situacao = pesos[obj[geo.translate("SITUACAO")]];
		
		let lastVisit = pesos["lastVisit"] * compareDates(obj[geo.translate("ultima manutenção bsg")]);


		let pontuacao = 4 + distance + vazao + situacao + lastVisit;
		pontuacao = parseFloat(pontuacao.toFixed(2));
		ordedObjs.push([pontuacao, obj]);
	}

	ordedObjs = ordedObjs.sort((a, b) => {
		return b[0] - a[0];
	});

	return ordedObjs;
}

function compareDates(dateOne, dateTow){

	if(dateTow == undefined){
		dateTow = new Date();
		let h = dateTow.getHours();
		let m = dateTow.getMinutes()
		dateTow.setTime(dateTow.getTime() - (h*60 + m)*60*1000);
	} else {
		dateTow = dateTow.split("/");
		dateTow = {
			day: dateTow[0],
			month: dateTow[1]-1,
			year: dateTow[2],
		}
		dateTow = new Date(dateTow.year, dateTow.month, dateTow.day);		
	}

	dateOne = dateOne.split("/");
	dateOne = {
		day: dateOne[0],
		month: dateOne[1]-1,
		year: dateOne[2],
	}
	dateOne = new Date(dateOne.year, dateOne.month, dateOne.day);

	let timeDiference = dateTow.getTime() - dateOne.getTime();
	return parseInt((timeDiference/86400000).toFixed(0));
}

function uploadFile(){
	let data = csvToArray(dd, ';');
	let filters = [];
	for(let i = 3; i < data.labels.length;i++){
		filters.push(data.labels[i]);
	}

	data.labels.push('geoIcon');
	data.labels.push('hiden');
	data.labels.push('grupo');
}

