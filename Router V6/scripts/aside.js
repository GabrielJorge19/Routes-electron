class Aside{
	constructor(){
		this.objectDom = $('aside');
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
}