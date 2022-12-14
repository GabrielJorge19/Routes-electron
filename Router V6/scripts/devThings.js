let ff = (obj) => {return true};
let tt = obj => {return obj.id < 1000};
let ino = obj => {return obj.situacao == 'inoperante'};

setTimeout(() => {
	//console.clear();
	//selectObjsByFilters(filter);
}, 300); 

setTimeout(() => {
	let objs = mapa.distritos[0].objects;
	//objs.map(obj => obj.show());
	let point = {lat: -23.575315642127155, long: -46.43783569335938}

	//mapa.aside.showAside();
	//mapa.aside.showFilters();
	//mapa.filterObjs(objs, filter);
	//mapa.rankObjects(objs, point);
	//mapa.calcDistante(objs[0], objs[1]);
}, 1000); 















function exportObjs(){
	let ids = "";

	mapa.selectedObjs.map((obj) =>{
		ids += obj.id + '\n';
		obj.hide();
	});

	mapa.selectedObjs.splice(0, mapa.selectedObjs.length);
	console.log(ids);
}

function det(id){
	let obj = mapa.getObjects([id])[0];
	obj.setState('evidence');
}



let filter = {
	situacao: ['possivel de uso', 'inoperante']
}


/*
	Mudei as cores



*/
