let handle;




/*
setTimeout(function(){
	// Inicializa o programa com esses objetos
	// Assim eu não preciso importar um arquivo pra fazer testes.

	handle = new Handle();

	let data = csvToArray(dd);
	let filters = [];
	for(let i = 3; i < data.labels.length;i++){
		filters.push(data.labels[i]);
	}

	data.labels.push('geoIcon');
	data.labels.push('hiden');
	data.labels.push('grupo');

	//geo = new GeoQuadrantes(16, data.labels, data.data);
	$("header").removeClass("login");

	setTimeout(() => {
	//	buildFilters(filters);
	}, 3000);
	
}, 100);
*/

setTimeout(function(){
	//$('.look')[0].click();
	//$('.look')[1].click();
	//displayRank();

	//rankObjs(-23.554857, -46.584193, geo.data);
	
	//displayObjs(geo.data);
	let lat = -23.554857;
	let long = -46.584193;
	//console.log(geo.findObjsByDistance(geo.data, lat, long, 6));
	//console.log('Fazendo grupo');
	//makeGroups(geo.data, 1, 15);
	//L.DomEv
	//let a ent.disableClickPropagation(a);
	//L.DomEvent.off(a);
	//console.log('off done');
	//mapa.setZoom(14);
	//mapa.panTo(new L.LatLng(-23.555500310051162, -46.63212091504849));
	//mapa.flyTo([-23.555500310051162, -46.63212091504849], 16);
}, 1400); 

let places = [];
places['work'] = {
	lat: -23.554899,
	long: -46.584208
}