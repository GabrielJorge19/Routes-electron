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
				// Hide all objects
				this.mapa.distritos.map((distrito) => {
					distrito.objects.map(obj => obj.hide())
				})

				let targetValues = event.target.value.replaceAll(' ', ',').split(',');
				targetValues = targetValues.map((svalue) => {return parseInt(svalue)})
				let objs = this.mapa.getObjects(targetValues);
				objs.map(obj => obj.show());
				event.target.value = '';
			}
		});
	}
	overLengend(event){
		console.log("Sobre legenda", event.target);
	}
	legendClick(event){
		console.log("Legenda clicada ", event.target);
	}
	showFilters(){
		let stats = this.mapa.statistcs;
		let mapa = document.getElementById('mapa');
		let filtros = ['situacao', 'tipo', 'vazao'];

		let total = document.createElement("h1");
		total.innerText = `Total: ${stats.length}`;
		mapa.appendChild(total);

		filtros.map((filtro) => {
			let labels = Object.keys(stats[filtro]);
			let title = document.createElement("h1");

			title.innerText = filtro;
			mapa.appendChild(title);

			let div = document.createElement("div");
			div.id = filtro + 'div';

			labels.map((labelText) => {
				let labelLine = document.createElement('div');
				let chexkbox = document.createElement('input');
				let label = document.createElement('label');

				labelLine.className = 'labelLine';

				chexkbox.type = 'checkbox';
				chexkbox.id = labelText;
				chexkbox.name = labelText;
				chexkbox.className = 'filter';

				label.setAttribute('for', labelText);
				label.innerText = labelText;

		  		labelLine.appendChild(chexkbox);
		  		labelLine.appendChild(label);

		  		div.appendChild(labelLine);
			})

			mapa.appendChild(div);
		})

		let button = document.createElement('button');
		button.value = 'search';
		button.innerText = 'search';
		button.id = 'buttonFilters';
		button.addEventListener('click', () => {this.getFilters()});
		mapa.appendChild(button);


	}
	getFilters(){
		let chexkboxs = document.getElementsByClassName('filter');
		let filters = {}

		for(let i = 0;i < chexkboxs.length; i++){
			if(chexkboxs[i].checked){
				let filtroTitle = chexkboxs[i].parentElement.parentElement.id;
				filtroTitle = filtroTitle.slice(0, filtroTitle.indexOf('div'));
				let filtro = chexkboxs[i].id;

				if(filters[filtroTitle] == undefined){
					filters[filtroTitle] = [filtro]
				} else {
					filters[filtroTitle].push(filtro);
				}

			}
		}
		return filters;
	}
}

/*

	elemento
	mapa (distritos e cores)








*/






/*
mapa
distrito
hidrante
grupo
*/