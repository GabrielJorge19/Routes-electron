let ff = (obj) => {return true};
let tt = obj => {return obj.id < 1000};
let ino = obj => {return obj.situacao == 'inoperante'};
let leg;

 $(document).ready(function() { console.log('loaded') });


setTimeout(() => {
	//bad.calcStatistics();
	//leg = new Legenda(mapa);
	//console.clear();
}, 300); 

setTimeout(() => {
	//mapa.colorDistricts();
	
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