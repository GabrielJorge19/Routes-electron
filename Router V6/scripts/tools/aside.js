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

	

	overLengend(event){
		console.log("Sobre legenda", event.target);
	}
	legendClick(event){
		console.log("Legenda clicada ", event.target);

	}
}
let pp;


/*

	elemento
	mapa (distritos e cores)








*/






/*
distrito
hidrante
grupo
*/