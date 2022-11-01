// Esse arquivo existe para separar das funções que manipulam o front-end 
let grupos = [];
let keysPressed = [];


			
document.getElementById('searchBar').addEventListener('keydown', (event) => {

	if(event.keyCode == 13){
		let targetValue = event.target.value.replaceAll(' ', '').split(',');
		targetValue.map((id) => {
			let obj = objects[id];
			if(obj) createDivIcon(obj.lat, obj.long, 1).addTo(mapa);
		})
		event.target.value = '';
	}
});

document.getElementsByTagName('body')[0].addEventListener('keydown', (event) => {
	if((event.keyCode >= 65) && (event.keyCode <= 90)){
		let isPressed = keysPressed.findIndex((obj) => {return obj == event.keyCode});
		if(isPressed == -1){
			keysPressed.push(event.keyCode);
		}
	}
})
document.getElementsByTagName('body')[0].addEventListener('keyup', (event) => {
	keysPressed = keysPressed.filter((obj) => {
		return obj != event.keyCode;
	})
})

function displayObjs(objs, color = 'black'){
	hideObjs(geo.data);
	displayMoreObjs(objs, color);
}
function displayGroup(){
	console.log('mostrando grupo');
	hideObjs(geo.data);
	for(let i = 0;i < grupos.length;i++){
		grupos[i].circle = createCircle(grupos[i].origem[0], grupos[i].origem[1], grupos[i].raio);
		displayMoreObjs(grupos[i].objs);
	}
}
function displayMoreObjs(objs, color = 'black'){
	if(objs.length < 1000){
		//console.log('Exibindo ' + objs.length + ' objetos');
		for(let i = 0;i < objs.length;i++){
			let icon = objs[i][geo.translate('geoIcon')];

			icon = createIcon(objs[i][geo.translate('lat')], objs[i][geo.translate('long')], color, objs[i][geo.translate('id')]).addTo(mapa);
			geo.setValue([objs[i]], ['geoIcon'], [icon]);
			geo.setValue([objs[i]], ['hiden'], [false]);
		} 
	} else {
		console.log('Impossivel exibir mais de 200 objetos');
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
	for(let i = 0; i < groupCount; i++){
		let group = {
			id: grupos.length,
			objs: [],
			distance: 0,
			circle: null,
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
			//let objs = geo.findNextObjsByCod(group.objs[group.objs.length-1][geo.translate('id')], 1);
			
			let lat = group.objs[group.objs.length-1][geo.translate('lat')];
			let long = group.objs[group.objs.length-1][geo.translate('long')];
			let objs = geo.filterObjs(geo.data, ['grupo'], ['equal'], [[undefined]]);

			objs = geo.findObjsByDistance(objs, lat, long, 50);

			objs = objs.map((obj) => {
				return obj.obj
			});
			
			if(objs.length < 5){
				console.log(objs.length);
			}
			let obj = chooseObjs(group, objs);

			group.objs.push(obj);
		}

		let latAverage = 0;
		let longAverage = 0;
		
		for(let i = 0;i < group.objs.length;i++){
			latAverage += group.objs[i][geo.translate('lat')];
			longAverage += group.objs[i][geo.translate('long')];
		}

		group.origem = [latAverage/group.objs.length, longAverage/group.objs.length];

		let maxDistance = geo.findObjsByDistance(group.objs, group.origem[0], group.origem[1]);
		group.raio = maxDistance[maxDistance.length-1].distance;

		console.log(maxDistance);

		geo.setValue(group.objs, ['grupo'], [i]);
		grupos.push(group);
		hideObjs(group.objs);
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
	function getOrigin(objs){

	}

	return grupos
}
function handleMapClick(click){
	let id = geo.findQuadByCoordenada(click.latlng.lat, click.latlng.lng).id;
	if(id > -1){displayQuads([id]);}
}
function destacarObjsByCod(cods, color){
	
	let objs = geo.getObjsByQuadCod(cods);
}
function chooseObjs(group, objs){
	let lastObj = group.objs[group.objs.length -1];
	let lat = lastObj[geo.translate('lat')];
	let long = lastObj[geo.translate('long')];
	let unGroupedObjs = [];

	for(let o = 0; o < objs.length; o++){
		let objId = objs[o][geo.translate('id')];
		let nonRepeted = true;

		for(let i = 0; i < group.objs.length; i++){
			let groupObjId = group.objs[i][geo.translate('id')];
			if(groupObjId == objId){
				nonRepeted = false;
			}
		}
		if(nonRepeted){unGroupedObjs.push(objs[o]);}
	}
	// Aqui inicia a escolha do obj nao agrupado.
	return geo.whichIsCloser(lat, long, unGroupedObjs);
}

function aar(){
	let group = {
		id: grupos.length,
		objs: geo.getObjsByCods(pageStates['selecting'].selectedObjs),
		distance: 0,
		circle: null,
	}

	grupos.push(group);
	pageStates['selecting'].icons.map((icon) => {
		mapa.removeLayer(icon);
	});
	hideObjs(group.objs);

	pageStates['selecting'].selectedObjs = [];
}











function showAside(callback){
	$('aside').animate({width: '30%'}, "slow", callback);
}

function hideAside(callback){
	$('aside').animate({width: '0%'}, "slow", callback);
}

function scrollToo(target){
	showAside(() => {
		let height = document.getElementById(target).offsetTop;
		document.getElementsByTagName('aside')[0].scrollTo({
		  top: height,
		  behavior: 'smooth',
		})
	});
}

function displayDistStat(distName){
	showAside(() => {
		scrollToo('distrito');
		let stats = bad.getDistStat(distName)
		displayStats(stats)
	});

	function displayStats(stats){
		let tipoValue = (100 * stats.tipo['subterraneo']/stats.countObjs).toFixed() + "%";
		let situacaoValue = (100 * stats.situacao['possivel de uso']/stats.countObjs).toFixed() + "%";
		let vazaoValue = Object.values(stats.vazao);
		let vazaoLabels = Object.keys(stats.vazao);
		

		console.log(stats, vazaoValue);

		document.getElementById('DistTitle').textContent = stats.title;
		document.getElementById('total').textContent = stats.countObjs;


		const data = {
			//labels: vazaoLabels,
		  	datasets: [{
		  		label: 'Dataset 1',
		    	data: vazaoValue,
		      	backgroundColor: ['#ff0', '#f0f', '#aaf'],
		    }
		  ]
		};

		myChart.data = data;
		//myChart.data.datasets = data.datasets;
		myChart.update();
	}


}


let myChart;

function setupCharts(){
	myChart = new Chart(document.getElementById('vazao'), {type: 'pie', options: {responsive: true,}});
	


}
	










setTimeout(() => {setupCharts()}, 100);







/*
for(let i = 0;i < grupos.length;i++){
	for(let o = 0;o < grupos[i].objs.length;o++){
		console.log(grupos[i].objs[o][geo.translate('id')], i);
	}
}
*/	