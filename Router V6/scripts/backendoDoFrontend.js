// Esse arquivo existe para separar das funções que manipulam o front-end 
let grupos = [];
let keysPressed = [];


			
document.getElementById('searchBar').addEventListener('keydown', (event) => {

	if(event.keyCode == 13){
		let targetValues = event.target.value.replaceAll(' ', ',').split(',');
		targetValues = targetValues.map((svalue) => {return parseInt(svalue)})
		let objs = bad.getObjects(targetValues); // NÃO É BOM REFERENCIAR OS DISTRITOS POR "BAD"
		devDisplayObjects(objs);
		console.log(objs);

		event.target.value = '';
	}
});

document.getElementsByTagName('body')[0].addEventListener('keydown', (event) => {
	if((event.keyCode >= 65) && (event.keyCode <= 90)){
		let isPressed = keysPressed.findIndex((obj) => {return obj == event.keyCode});
		if(isPressed == -1){
			keysPressed.push(event.keyCode);
		}
	}
})
document.getElementsByTagName('body')[0].addEventListener('keyup', (event) => {
	keysPressed = keysPressed.filter((obj) => {
		return obj != event.keyCode;
	})
})

function displayDistStat(distName){
	showAside(() => {
		scrollToo('distrito');
		let stats = bad.getDistStat(distName)
		displayStats(stats)
	});

	function displayStats(stats){
		let tipoValue = (100 * stats.tipo['subterraneo']/stats.countObjs).toFixed() + "%";
		let situacaoValue = (100 * stats.situacao['possivel de uso']/stats.countObjs).toFixed() + "%";
		let vazaoValue = Object.values(stats.vazao);
		let vazaoLabels = Object.keys(stats.vazao);
		

		console.log(stats, vazaoValue);

		document.getElementById('DistTitle').textContent = stats.title;
		document.getElementById('total').textContent = stats.countObjs;


		const data = {
			//labels: vazaoLabels,
		  	datasets: [{
		  		label: 'Dataset 1',
		    	data: vazaoValue,
		      	backgroundColor: ['#ff0', '#f0f', '#aaf'],
		    }
		  ]
		};

		myChart.data = data;
		//myChart.data.datasets = data.datasets;
		myChart.update();
	}


}


let myChart;

function setupCharts(){
	myChart = new Chart(document.getElementById('vazao'), {type: 'pie', options: {responsive: true,}});
	


}
	










setTimeout(() => {setupCharts()}, 100);