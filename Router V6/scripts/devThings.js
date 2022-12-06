let ff = (obj) => {return true};
let tt = obj => {return obj.id < 1000};
let ino = obj => {return obj.situacao == 'inoperante'};

setTimeout(() => {
	console.clear();
	//selectObjsByFilters(filter);
}, 300); 

setTimeout(() => {
	
}, 400); 



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

function selectObjsByFilters(filters){
	let t = 0;
	let objs = [];
	mapa.distritos.map((distrito) => {
		let filteredObjs = distrito.objects.filter((obj) => {
			let filteredPassed = true;
			Object.keys(filters).map((filter) => {
				if(!(filters[filter].indexOf(obj[filter]) != -1))filteredPassed = false;
			});
			return filteredPassed;
		})
		objs = objs.concat(filteredObjs);
	})
	return objs;
}

let filter = {
	distrito: ['itaim paulista', 'anhanguera'],
	tipo: ['coluna']
}


/*
	Mudei as cores



*/
