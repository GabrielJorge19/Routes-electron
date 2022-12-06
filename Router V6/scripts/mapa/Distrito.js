class Distrito{
	constructor(feature, mapa){
		feature.distrito = this;
		this.name = feature.properties.NOME_DIST.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
		this.mapa = mapa;
		this.properties = {...feature.properties}
		this.objects = [];
		this.layer = L.geoJSON(feature, {style: this.style, onEachFeature: this.onEachFeature});
	}

	addObjects(objs){
		this.objects = this.objects.concat(objs);
		this.calcStatistics();
	}
	hide(){
		this.layer._map.removeLayer(this.layer);
	}
	show(){
		this.layer.addTo(this.mapa);
	}

	showObjects(options){
		devDisplayObjects(this.objects);
	}

	getObjects(ids){
		
		let objs = this.objects.filter((obj) => {
			return ids.indexOf(obj.id) != -1;
		})

		//return this.objects.filter((obj) => {return obj.id == id})
		return objs;
	}

	onEachFeature(feature, layer){

		function click(e){
			this._map.fitBounds(e.target.getBounds());

			let dist = feature.distrito;
			console.log(dist.name, dist.getStatistics());
		}

		function mouseout(e) {
			feature.distrito.layer.setStyle({...feature.distrito.style});
		}
		function mouseover(e){
			var layer = e.target;
			layer.setStyle({
				weight: 1,
				//color: "#0ff",
				fillOpacity: 1,
			});

			if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				layer.bringToFront();
			}
		}

		layer.on({
			mouseover: mouseover,
			mouseout: mouseout,
			click: click
		});
	}

	setStyle(style){
		//style = {...style, color: '#666'}
		this.style = style;
		this.layer.setStyle(style);
	}

	calcStatistics(){
		let statistcsColuns = ["bairro", "tipo", "vazao", "situacao"];
		let stat = {}

		statistcsColuns.map((label) => {
			stat[label] = {};
		});

		this.objects.map((obj) => {
			statistcsColuns.map((label) => {
				if(stat[label][obj[label]] == undefined){
					stat[label][obj[label]] = 1;
				} else {
					stat[label][obj[label]]++;
				}
			})
		})

		stat.length = this.objects.length;

		this.statistcs = stat;
	}

	getStatistics(){
		return this.statistcs;
	}
}