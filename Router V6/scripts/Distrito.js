let tr;

class Distrito{
	constructor(feature, mapa){
		feature.distrito = this;
		this.name = feature.properties.NOME_DIST.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
		this.properties = {...feature.properties}
		this.objects = [];
		this.statistcs = {}
		//this.style = {"color": "#0015ff","weight": 1,"opacity": .5};
		this.layer = L.geoJSON(feature, {style: this.style, onEachFeature: this.onEachFeature}).addTo(mapa);
	}

	addObjects(objs){
		this.objects = this.objects.concat(objs);
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
			console.log(dist.name, dist.objects.length);
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
		this.style = style;
		this.layer.setStyle(style);
	}

	calcStatistics(distName){
		let objs = this.distritos[distName].objects;
		let stat = {bairro: {}, tipo: {}, vazao: {}, situacao: {}, countObjs: 0, title: distName,}
		let statistcsColuns = ["bairro", "tipo", "vazao", "situacao"];

		for(let id in objs){
			let obj = objs[id];
			for(let i = 0;i < statistcsColuns.length;i++){
				let label = statistcsColuns[i];
				let value = stat[label][obj[label]];
				stat[label][obj[label]] = (value == undefined)?1:++value;
			}
			stat.countObjs++;
		}
		this.statistcs[distName] = stat;
	}












	getDistStat(distName){
		let testStat = {
			bairro: {
				'alto do ipiranga': 2,
				ipiranga: 1,
				'sacomã': 1,
				'vila independ�ncia': 1,
				'vila monumento': 1,
				'vila s�o jos�': 1,
			},
			countObjs: 7,
			title: 'Ipiranga',
			situacao: {
				inoperante: 4,
				'possivel de uso': 3,
			},
			tipo: {
				subterraneo: 7,
			},
			vazao: {
				fraca: 1,
				média: 2,
				seco: 4,
			}
		}

		//return testStat;
		return this.statistcs[distName];
	}
}