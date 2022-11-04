let pageStates = [];
let pageFocus = "selecting";
let groupSize = 11 ;

pageStates['watching'] = {
	mouseDownCoordinate: [],

	onFocus: () => {
		console.log("User watching");
	},
	onLeaveFocus: () => {
		console.log("User stoped watching");	
	},
	onMapClick: (event) => {
		//console.log('Mouse clicked while watching');
		displayObjsOfRegion(event.latlng.lat, event.latlng.lng);
	},
	onMouseDown: (event) => {
		mouseDownCoordinate = [event.latlng.lat, event.latlng.lng];
		//console.log(mouseDownCoordinate);
	},
	onMouseUp: (event) => {
		//console.log(event.latlng.lat, event.latlng.lng);
	},
}

pageStates['selecting'] = {
	selectedObjs: [],
	icons: [],
	onFocus: () => {
		let thisPage = pageStates['selecting'];
		
		for(let i = 0; i < thisPage.selectedObjs.length;i++){
			let id = thisPage.selectedObjs[i];
			let obj = geo.findObjByCod([id]);
			let icon = createIcon(obj[geo.translate('lat')], obj[geo.translate('long')], 'blue', id).addTo(mapa);
			thisPage.icons.push(icon);
		}

	},
	onLeaveFocus: () => {
		let thisPage = pageStates['selecting'];

		for(let i = 0; i < thisPage.icons.length;i++){
			let marker = thisPage.icons[i];
			mapa.removeLayer(marker);
		}
	},
	onMapClick: (event) => {
		//console.log("User clicked on map");
	},
	onIconClick: (id) => {
		let thisPage = pageStates['selecting'];
		let index = thisPage.selectedObjs.indexOf(id);
		let isLetterGPressed = keysPressed.findIndex((obj) => {return obj == 71});
		
		if(isLetterGPressed != -1){
			let obj = geo.findObjByCod([id]);

			let indexs = Object.keys(objetosDoMapa);
			let objs = [];
			
			for(let i = 0;i < indexs.length;i++){
				let obj = objetosDoMapa[indexs[i]];
				if(obj.visible){
					objs = objs.concat(obj.objs);
				}
			}

			makeGroups(objs, 1, groupSize, 1, [obj]);
		} else {
			if(index != -1){
				let marker = thisPage.icons[index];
				mapa.removeLayer(marker);
				thisPage.selectedObjs.splice(index, 1);
				thisPage.icons.splice(index, 1);
			} else {
				thisPage.selectedObjs.push(id);
				let obj = geo.findObjByCod([id]);
				let icon = createIcon(obj[geo.translate('lat')], obj[geo.translate('long')], 'blue', id).addTo(mapa);
				thisPage.icons.push(icon);
			}
		}
	},
	exportSelectedIds: () => {
		let thisPage = pageStates['selecting'];

		if(thisPage.selectedObjs.length > 0){
			let idList = thisPage.selectedObjs[0];

			for(let i = 1; i < thisPage.selectedObjs.length; i++){
				idList += `, ${thisPage.selectedObjs[i]}`;
			}

			idList += `.`;

			console.log(idList);
		} else {
			console.log('Nao ha objetos selecionados');
			console.log(thisPage);
		}
	},
	exportSelectedObjs: () => {
		let thisPage = pageStates['selecting'];

		return geo.getObjsByCods(thisPage.selectedObjs);
	},
}

pageStates['grouping'] = {
	circle: null,
	objs: [],
	onMapClick: (event) => {
		if(keysPressed.length == 1){

			switch(keysPressed[0]){
				case 68:
					let objs = geo.findObjsByDistance(geo.data, event.latlng.lat, event.latlng.lng, 10);
					objs = objs.map((item) => {
						return item.obj;
					});
					this.objs = objs;
					displayObjs(objs);
					//console.log(event.latlng.lat + ', ' + event.latlng.lng, objs.length);
					
					if(this.circle != null){
						mapa.removeLayer(this.circle);
					}
					this.circle = createCircle(event.latlng.lat, event.latlng.lng, 10);
				break;
				case 65:
					let s = 'Hidrantes: ';
					s += this.objs.map((obj) => {
						return obj[geo.translate('id')];
					});
					console.log(s);
				break;
				default:
					console.log("Tecla " + keysPressed[0] + " pressionada");
				break;
			}
		} else {
			console.log('Mais de uma tecla pressionada ', keysPressed);
		}
	},
	onIconClick: (id) => {
		if(keysPressed.length == 1){
			let obj = geo.findObjByCod([id]);

			switch(keysPressed[0]){
				case 71:
					makeGroups(geo.data, 1, 12, 1, [obj]);
					console.log('made gropup');
				break;
			}
		}
	},
}

function ext(){
	console.log(pageStates['selecting'].exportSelectedObjs());
}

















function changePageFocus(state){
	if(pageFocus == state){
		console.log('equal focus');
	} else {
		pageStates[pageFocus].onLeaveFocus();
		pageStates[state].onFocus();
		pageFocus = state;
	}
}