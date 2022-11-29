let bad;
//let aside;

setTimeout(() => {
	bad = new Mapa(bairros);
	//aside = new Aside();
}, 100); 

setTimeout(() => {
	bad.loadObjects(objects);
}, 200); 






setTimeout(() => {
	console.clear();
	bad.colorDistricts();
	bad.calcStatistics();
}, 400); 



function exportObjs(){
	let ids = "";

	bad.selectedObjs.map((obj) =>{
		ids += obj.id + '\n';
		obj.hide();
	});

	//bad.selectedObjs = [];
	bad.selectedObjs.splice(0, bad.selectedObjs.length);
	console.log(ids);
}