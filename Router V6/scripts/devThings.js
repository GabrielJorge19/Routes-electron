let bad;
let aside;

setTimeout(() => {
	bad = new Distritos(bairros);
	aside = new Aside();
}, 200); 

setTimeout(() => {
	bad.loadObjects(objects);
}, 400); 






setTimeout(() => {
	console.clear();
	bad.colorDistricts();
}, 800); 




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


