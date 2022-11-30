class Mapa{
	constructor(geojson = bairros){
		this.aside = new Aside(this);
		this.distritos = [];
		this.mapa = L.map('map', {zoomControl: false}).setView([-23.555500310051162, -46.63212091504849], 10);
		this.stretsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})
		this.selectedObjs = [];
		this.colors = ['#008080', '#20B2AA', '#48D1CC', '#836FFF', '#483D8B'];
		this.initDistricts(geojson);
		console.log('Class distritos loaded!');
	}	

	showTileLayer(){		
		this.stretsLayer.addTo(this.mapa);
	}
	hideTileLayer(){
		this.mapa.removeLayer(this.stretsLayer);
	}
	show(){
		this.distritos.map((dist) => {dist.show();})
	}
	hide(){
		this.distritos.map((dist) => {dist.hide();})
	}
	calcStatistics(){
		let stats = {length: 0, maxDistObjsCount: 0}
		let labels = ["tipo", "vazao", "situacao"];
		labels.map((label) => {
			stats[label] = {}
		})

		this.distritos.map((distrito) => {
			let distStats = distrito.getStatistics();
			if(stats.maxDistObjsCount < distStats.length) stats.maxDistObjsCount = distStats.length;
			stats.length += distStats.length;
			
			labels.map((label) => {
				let subLabels = Object.keys(distStats[label]);

				subLabels.map((subLabel) => {
					if(stats[label][subLabel] == undefined){
						stats[label][subLabel] = distStats[label][subLabel];
					} else {
						stats[label][subLabel] += distStats[label][subLabel];
					}
				})
			})			
		})

		this.statistcs = stats;
	}
	displayObjects(objs){
		objs.map((obj) => {obj.show();})
	}
	initDistricts(geojson){
		for(let i in geojson.features){
			let geo = geojson.features[i];

			var myStyle = {
				"color": (i%2 == 0)?"#ff7800":"#427ef5",
				"weight": 2,
				"opacity": 0.65
			};

			this.distritos.push(new Distrito(geo, this.mapa));
		}
		this.show();
	}
	getObjects(ids){
		let objs = [];

		this.distritos.map((distrito) => {
			objs = objs.concat(distrito.getObjects(ids));
		})

		return this.orderObjsById(objs);
	}
	orderObjsById(objs){
		objs.sort((a, b) => {
			if(a.id < b.id){return -1;}
			if(a.id > b.id){return 1;}
			return 0;
		});

		return objs;
	}
	loadObjects(objects){
		objects = objects.map((obj) => {
			return new Hidrante({...obj, mapa: this.mapa, selectedObjs: this.selectedObjs});
		});

		this.distritos.map((distrito) => {
			let objs = objects.filter((obj) => {
				return obj.distrito == distrito.name;
			});

			distrito.addObjects(this.orderObjsById(objs));
		});

		console.log('loaded');
	}
	colorDistricts(){
		let maxObjectsCount = 0;
		this.distritos.map((distrito) => {
			if(distrito.objects.length > maxObjectsCount){maxObjectsCount = distrito.objects.length;}
		})

		this.distritos.map((distrito) => {
			let color = this.colorScale(distrito.objects.length);
			distrito.setStyle({color, opacity: 1, weight: 1, fillOpacity: .5});
		})
	}
	colorScale(value, max = this.statistcs.maxDistObjsCount, colors = this.colors){
		let colorGroupSize = Math.round(max/colors.length);
		let index = Math.floor(value/colorGroupSize);
		return colors[index];
	}
}
 

