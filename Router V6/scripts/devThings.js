let bad;

setTimeout(() => {
	bad = new Mapa(bairros);
}, 100); 

setTimeout(() => {
	bad.loadObjects(objects);
}, 200); 


setTimeout(() => {
	bad.calcStatistics();
	//console.clear();
}, 300); 

setTimeout(() => {
	bad.colorDistricts();
	bad.aside.setLegend();
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