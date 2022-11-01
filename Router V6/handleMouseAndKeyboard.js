class Handle {
	constructor(){
		//console.log('Create handle');
		this.selectedObjs = [];
	}
	mapClick(event){
		
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
				s += ' ' + this.objs.map((obj) => {
					return obj[geo.translate('id')];
				});
				console.log(s);
			break;
			default:
				//console.log("Tecla " + keysPressed[0] + " pressionada");
			break;
		}
	}
	iconClick(event){
		console.log(event);
	}
}