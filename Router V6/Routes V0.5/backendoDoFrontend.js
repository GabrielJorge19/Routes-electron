// Esse arquivo existe para separar das funções que manipulam o front-end 
  
function csvToArray(string, separador){
	string = string.replaceAll('\r', ``);
	let array = [];
  	let linhas = string.split('\n');
  	let labels = linhas[0].split(separador);
  	
  	for(let i = 0;i < linhas.length-1; i++){
  		let linha = linhas[i+1].split(separador);
  		let linhaDoArray = [];
  		for(let o = 0; o < linha.length; o++){
 			let value = parseFloat(linha[o]);
   			value = (!isNaN(value))?value:linha[o];
  			linhaDoArray.push(value);
   		}
  		array.push(linhaDoArray);
  	}
  	return {data: array, labels: labels};
}
function readFileHere(file, callback){
	var reader = new FileReader();
  	reader.readAsDataURL(file);
  	setTimeout(function(){
		let q = (reader.result).split(',');
		callback(atob(q[1]));
		// Antigo
			views[5].data = atob(q[1]);
			views[5].previewData();
  	}, 1000);   
}
function displayObjs(objs, color = 'black'){
	hideObjs(geo.data);
	displayMoreObjs(objs, color);
}
function displayMoreObjs(objs, color = 'black'){
	for(let i = 0;i < objs.length;i++){
		let icon = objs[i][geo.translate('geoIcon')];

		icon = createIcon(objs[i][geo.translate('lat')], objs[i][geo.translate('long')], color, objs[i][geo.translate('id')]).addTo(mapa);
		geo.setValue([objs[i]], ['geoIcon'], [icon]);
		geo.setValue([objs[i]], ['hiden'], [false]);
	} 
} 
function hideObjs(objs){
	geo.setValue(objs, ['hiden'], [true]);

	for(let i = 0;i < objs.length;i++){
		let marker = objs[i][geo.translate('geoIcon')];
		if(marker != undefined){
			mapa.removeLayer(marker);
		}
	}
}
function displayQuads(quadCods){
	let objs = geo.getObjsByQuadCod(quadCods);
	displayObjs(objs);
}
function makeGroups(objs, groupCount, size, maxDistance = 10, initials = []){
	let grupos = [];

	for(let i = 0; i < groupCount; i++){
		let group = {
			id: i,
			objs: [],
			distance: 0,
			origem: ["lat", "long"],
			raio: 5, // KM
		};

		if(initials[i] != undefined){
			if(initials[i][geo.translate('grupo')] == undefined){
				group.objs[0] = initials[i];
			} else {
				group.objs[0] = getRamdonUngroupedObj(objs);
			}
		} else {
			group.objs[0] = getRamdonUngroupedObj(objs);
		}

		for(let o = 0;o < size -1; o++){
			let gotObjects = [];

			for(let o = 0; o < group.objs.length; o++){
				gotObjects.push(group.objs[o][geo.translate('id')]);
			}

			//let obj = geo.findNextObjByCod(group.objs[group.objs.length-1][geo.translate('id')], ['grupo', 'id'], ['equal', 'diferent'], [[undefined], gotObjects]);
			let objs = geo.findNextObjsByCod(group.objs[group.objs.length-1][geo.translate('id')], 1,['grupo', 'id'], ['equal', 'diferent'], [[undefined], gotObjects]);

			let lastObj = group.objs[group.objs.length -1];
			let obj = chooseObjs(lastObj[geo.translate('lat')], lastObj[geo.translate('long')], objs);
			console.log(lastObj[geo.translate('id')], obj[geo.translate('id')])			
			//console.log("Grupo " + i + " objs " + (o + 1) + " Id: " + obj[geo.translate('id')]);

			group.objs.push(obj);
		}

		geo.setValue(group.objs, ['grupo'], [i]);
		grupos.push(group);

		displayObjs(grupos[0].objs);
	}

	function getRamdonUngroupedObj(objs){
		let list = [];

		for (let i = 0; i < objs.length; i++) {
		   list[i] = i;
		}

		for (let i = list.length; i;) {
		    let randomNumber = Math.random() * i-- | 0;
		    let tmp = list[randomNumber];
		    list[randomNumber] = list[i];
		    list[i] = tmp;
		}

		for (let i = 0; i < list.length; i++) {
		   	let obj = objs[list[i]];
		   	if(obj[geo.translate("grupo")] == undefined){
		   		return objs[list[i]];
		   	}
		}
	}

	return grupos;
}
function handleMapClick(click){
	let id = geo.findQuadByCoordenada(click.latlng.lat, click.latlng.lng).id;
	if(id > -1){displayQuads([id]);}
}
function destacarObjsByCod(cods, color){
	
	let objs = geo.getObjsByQuadCod(cods);
}
function chooseObjs(lat, long, objs){

	return geo.whichIsCloser(lat, long, objs);
}

