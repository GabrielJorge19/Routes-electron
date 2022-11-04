	var mapa = L.map('map', {zoomControl: false}).setView([-23.555500310051162, -46.63212091504849], 10);
	let objetosDoMapa = [];
	let refreshMap = false;
	
	/*
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(mapa);
*/


	function createIcon(lat, long, color, id){

		return  L.marker([lat, long], {icon: icones[color]})
				.on('click', () => {
					pageStates[pageFocus].onIconClick(id);
					//handle.iconClick(id);
				})
				.bindPopup(`Id: ` + id)
	}

	function createDivIcon(lat, long, number){
		var icon = L.divIcon({
			className: 'my-div-icon', 
			html: `<div><div id='icon-circle'></div><div id='icon-line'></div></div>`, 
			iconSize: [20, 31],
			iconAnchor: [10, 31],
			popupAnchor: [0, -55]
		});

		return  L.marker([lat, long], {icon: icon});
	}




 






	function createCircle(lat, long, r = 2){
		return L.circle([lat, long], {
	     	color: 'red',
	     	fillColor: '#f03',
	    	fillOpacity: 0.5,
	    	radius: r*1000,
		}).addTo(mapa);
	}
	function findLocation(lat, long){
		mapa.setView([lat, long]);
		let marker = L.marker([lat, long], {icon: icones['green']}).addTo(mapa);
	}

function atualizarMapa(exec = false){
	if(!refreshMap || exec){
		refreshMap = true;
		let indexs = Object.keys(objetosDoMapa);
		let repeat = false;
		
		for(let i = 0;i < indexs.length;i++){
			let obj = objetosDoMapa[indexs[i]];
			if(obj.changed){
				repeat = true;
				obj.changed = false;
				obj.refresh = true;
			} else if(obj.refresh){
				obj.refresh = false;
				displayFilter(indexs[i]);
			}
		}

		if(repeat){
			setTimeout(() => {
				atualizarMapa(true);
			}, 1000);
		} else {
			refreshMap = false;
		}
	}
	
}

function displayFilter(index){
	let obj = objetosDoMapa[index];

	hideObjs(obj.objs);

	if(obj.visible){
		displayMoreObjs(obj.objs, obj.icon);
	}
}

