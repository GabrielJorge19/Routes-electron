let geo; 

document.getElementById('importFile-button').addEventListener('click', views[5].proccedFile);
document.getElementById('preview').addEventListener('click', () => {
	let file = document.getElementById('dados').files[0];
	readFileHere(file, (fileData) => {
		let separador = document.getElementById('valueDivisor').value;
		let data = csvToArray(fileData, separador);

		let filters = [];
		for(let i = 3; i < data.labels.length;i++){
			filters.push(data.labels[i]);
		}
		console.log(filters);

		data.labels.push('geoIcon');
		data.labels.push('hiden');
		data.labels.push('grupo');
		console.log(data);

		geo = new GeoQuadrantes(16, data.labels, data.data);
	});
});   
 






