class Legenda{
	constructor(mapa){
		//console.log('Legenda ok ', options);
		//Object.keys(options).map((a) => this[a] = options[a])
		this.objectDom = document.getElementById('legend');
		this.lines = [];
		this.mapa = mapa;
		this.init();
	}
	init(){
		let colors = this.mapa.colors;

		colors.map((color, index) => {
			let lineDiv = document.createElement('div');
			lineDiv.innerText = '-';
			lineDiv.className = "legend-line";
			lineDiv.id = `${index}`;
			lineDiv.style.backgroundColor = `#ccc`;
			lineDiv.style.backgroundColor = `${color}aa`;
			lineDiv.addEventListener('mouseover', this.overLengend);
			lineDiv.addEventListener('click', this.legendClick);
			this.objectDom.appendChild(lineDiv);

			let legendLine = {
				id: index,
				rangeInit: 0,
				rengeEnd: 0,
				objectDom: lineDiv,
				color: color
			}

			this.lines[index] = legendLine;
		})
	}
	update(max){
		let classifySize = Math.floor(max/this.lines.length) + 1;

		this.lines.map((line, index) => {
			line.rangeInit = index * classifySize + ((index == 0)?0:1);
			line.rangeEnd = (index+1) * classifySize;
			line.objectDom.innerText = `${line.rangeInit} - ${line.rangeEnd}`;
		})
	}
}