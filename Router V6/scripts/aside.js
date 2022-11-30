class Aside{
	constructor(mapa){
		this.mapa = mapa;
		this.objectDom = $('aside');
		this.setEventListeners();
		
		
		
	}

	showAside(callback){
		this.objectDom.animate({width: '30%'}, "slow", callback);
	}

	hideAside(callback){
		this.objectDom.animate({width: '0%'}, "slow", callback);
	}

	scrollToo(target){
		this.showAside(() => {
			let height = document.getElementById(target).offsetTop;
			document.getElementsByTagName('aside')[0].scrollTo({
			  top: height,
			  behavior: 'smooth',
			})
		});
	}

	setEventListeners(){
		document.getElementById('searchBar').addEventListener('keydown', (event) => {
			if(event.keyCode == 13){
				let targetValues = event.target.value.replaceAll(' ', ',').split(',');
				targetValues = targetValues.map((svalue) => {return parseInt(svalue)})
				let objs = this.mapa.getObjects(targetValues);
				objs.map(obj => obj.show());
				event.target.value = '';
			}
		});
	}

	setLegend(){
		let legend = document.getElementById('legend');
		let max = this.mapa.statistcs.maxDistObjsCount;
		let colors = this.mapa.colors;
		let colorGroupSize = Math.round(max/colors.length);

		colors.map((color, index) => {
			let lineDiv = document.createElement('div');
			lineDiv.innerHTML = `<p>${index * colorGroupSize + 1} - ${(index+1) * colorGroupSize}</p>`;
			lineDiv.className = "legend-line";
			lineDiv.style.backgroundColor = `${color}aa`;
			legend.appendChild(lineDiv);
		})
	}
}

/*
distrito
hidrante
grupo
*/