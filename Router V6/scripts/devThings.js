


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
	//buildGroupByLocation();

	test();
}, 500); 















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




function getVisibleObjects(){
	let objs = [];
	mapa.distritos.map((distrito) => {
		objs = objs.concat(distrito.objects.filter((obj) => {
			return obj.visible;
		}))
	})
	return objs;
}


function buildGroupByLocation(point, objs = getVisibleObjects()){
	let group = [];
	let size = 3;

	objs = objs.filter((obj) => {
		return (obj.state != "evidence");
	});
 
	for(let i = 0; i < size; i++){
		let betterObjs = mapa.rankObjects(objs, objs[0])[0];
		objs.splice(objs.indexOf(betterObjs), 1);
		group.push(betterObjs);
	}
	console.log(group);

	group.map((obj) => {det(obj.id)})

}










function findDistByName(name){
	let dist = mapa.distritos.filter((d) => {
		return name == d.name;
	})
	console.log(dist);
}






function test(){
	let obj = mapa.getObjects([1])[0];
	obj.show();
	obj.setLabel('1');
}





let filter = {
	situacao: ['possivel de uso', 'inoperante']
}


/*

Feito o rank com base na ultima manutenção.






*/
