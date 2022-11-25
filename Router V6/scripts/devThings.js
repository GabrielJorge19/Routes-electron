let bad;
let aside;

setTimeout(() => {
	bad = new Distritos(bairros);
	aside = new Aside();
}, 100); 

setTimeout(() => {
	bad.loadObjects(objects);
}, 200); 






setTimeout(() => {
	console.clear();
	bad.colorDistricts();
	bad.calcStatistics();
}, 400); 




let icons = [];

function devDisplayObjects(objs){
	icons = icons.concat(bad.displayObjects(objs));
}

function devRemoveObjects(){
	icons.map((icon) => {
		bad.mapa.removeLayer(icon);
	});

	icons = [];
}


