class Hidrante{
	constructor(options){

		this.label = '';
		this.setAttributes(options);
		this.colors = {default: 'blue',selected: 'white', evidence: 'yellow'};
		this.state = "default";
		this.visible = false;
	}
	setAttributes(options){
		let attributes = Object.keys(options);

		attributes.map((a) => {
			this[a] = options[a];
		})
	
		let icon = L.divIcon({
			className: 'my-div-icon', 
			html: `<div><div id=${options.id} class='icon-circle'></div><div class='icon-line'></div></div>`, 
			iconSize: [20, 31],
			iconAnchor: [10, 31],
			popupAnchor: [0, -55]
		});

		icon = L.marker([options.lat, options.long], {icon: icon, obj: this});
		icon.bindPopup(`Id: ${options.id}`);
		this.icon = icon;
	}
	setLabel(label){
		let dom = document.getElementById(this.id);
		dom.innerText = label;
		console.log(dom, label);
	}
	setState(string){
		this.state = string;

		document.getElementById(this.id).style.backgroundColor = this.colors[string];
	}
	show(){
		this.icon.addTo(this.mapa).on('click', this.click);
		this.visible = true;
	}
	hide(){
		this.mapa.removeLayer(this.icon);
		this.visible = false;
	}
	click(){
		let obj = this.options.obj;
		let index = obj.selectedObjs.indexOf(obj);
		let objState = (index != -1)?'default':'selected';
		//obj.setState(objState);

		if(objState == 'default'){
		//	obj.selectedObjs.splice(index, 1);
		} else {
		// 	obj.selectedObjs.push(obj);
		}

		buildGroupByLocation(this);
	}
}