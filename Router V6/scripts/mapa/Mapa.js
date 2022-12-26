class Mapa{
	constructor(geojson = bairros){
		//this.colors = ['#008080', '#20B2AA', '#48D1CC', '#836FFF', '#483D8B'];
		this.colors = ['#81C784', '#4CAF50', '#388E3C', '#1B5E20', '#00C853'];
		this.legenda = new Legenda(this);
		this.aside = new Aside(this);
		this.distritos = [];
		this.mapa = L.map('map', {zoomControl: false}).setView([-23.555500310051162, -46.63212091504849], 10);
		this.mapa['mapa'] = this;
		//this.mapa.on('click', (e) => {console.log(e.latlng);});
		this.stretsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})
		this.selectedObjs = [];
		this.createDistricts(geojson);
		this.propertiesScore = {
			situacao: {
				"possivel de uso": 0,
				"inoperante": 0,
				"nao localizado": 0
			},
			vazao: {
				excelente: 0,
				media: 0,
				fraca: 0,
				seco: 0,
				"": 0
			},
			distance: {
				maxScore: 10,
				maxDistance: 1
			},
			date: {
				maxScore: 0,
				maxDate: 40
			}
		}
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
		let filterFunction = obj => {return true}
		this.classifyDistricts(filterFunction);
	}
	displayObjects(objs){
		objs.map((obj) => {obj.show();})
	}
	hideAllObjects(){
		this.distritos.map((dist) => {
			dist.objects.map((obj) => {
				obj.hide();
			})
		})
	}
	createDistricts(geojson){
		for(let i in geojson.features){
			let geo = geojson.features[i];

			var myStyle = {
				"color": (i%2 == 0)?"#ff7800":"#427ef5",
				"weight": 2,
				"opacity": 0.65
			};

			this.distritos.push(new Distrito(geo, this.mapa));
		}

		this.loadObjects(objects);
	}
	getObjects(ids){
		let objs = [];

		this.distritos.map((distrito) => {
			objs = objs.concat(distrito.getObjects(ids));
		})

		return this.orderObjsById(objs);
	}
	getObjsByFilters(filters){
		let objs = [];
		this.distritos.map((distrito) => {
			let filteredObjs = this.filterObjs(distrito.objects, filters);
			objs = objs.concat(filteredObjs);
		})

		if(objs.length < 1)objs.map(obj => obj.show());

		console.log(objs.length);
		
		//return objs;
	}
	filterObjs(objs, filters){
		let filteredObjs = objs.filter((obj) => {
			let filteredPassed = true;
			Object.keys(filters).map((filter) => {
				if(!(filters[filter].indexOf(obj[filter]) != -1))filteredPassed = false;
			});
			return filteredPassed;
		})
		return filteredObjs;
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
		this.calcStatistics();
	}
	classifyDistricts(filterFunction){
		let maxObjectsCount = 0;
		this.distritos.map((distrito) => {
			let filteredObjs = distrito.objects.filter(filterFunction).length
			if(filteredObjs > maxObjectsCount){maxObjectsCount = filteredObjs;}
		})

		this.distritos.map((distrito) => {
			let objCount = distrito.objects.filter(filterFunction).length;
			let color = this.colorScale(objCount, maxObjectsCount);
			distrito.setStyle({color: color, opacity: 1, weight: 1, fillOpacity: .5});
			distrito.show();
		})

		this.legenda.update(maxObjectsCount);
	}
	colorScale(value, max = this.statistcs.maxDistObjsCount, colors = this.colors){
		let colorGroupSize = Math.floor(max/colors.length) + 1;
		let index = Math.floor(value/colorGroupSize);
		if(index < 0 || index >= colors.length) console.log(index, value, colorGroupSize);
		return colors[index];
	}
	rankObjects(objs, point){
		let date = new Date().getTime();
		//console.log(objs, point);

		objs.map((obj) => {
			let distance = this.calcDistante(obj, point) * 1000;

				// Pontuação por distancia 
			let distanceScore = (this.propertiesScore.distance.maxDistance * 1000) + (Math.floor(-distance) - 1);
			distanceScore /= this.propertiesScore.distance.maxDistance * 1000;
			distanceScore *= this.propertiesScore.distance.maxScore;
			distanceScore = parseFloat(distanceScore.toFixed(1));

				// Pontuação por propriedade
			obj.score = this.propertiesScore.situacao[obj.situacao];
			obj.score += this.propertiesScore.vazao[obj.vazao];
			obj.score += distanceScore;

				// Pontuação por data
			let um = obj['ultima manutencao'].split('/');
			um = new Date(um[2] + '-' + um[1] + '-' + um[0]).getTime();
			let timeDistance = Math.floor((date - um)/(1000 * 60 * 60 * 24));
			let score = (2*timeDistance/this.propertiesScore.date.maxDate)-1;
			score *= this.propertiesScore.date.maxScore;
			score = (score > this.propertiesScore.date.maxScore)?this.propertiesScore.date.maxScore:score;
			obj.score += parseFloat(score);
		});

		objs.sort((a, b) => {
			if(a.score == b.score) return 0;
			if(a.score < b.score) return 1 ;
			return -1;
		});

		objs.map((obj) => {
			let text = obj.score + ", " + obj.situacao + ", " + obj.vazao + ".";
			//console.log(text);
		});

		//this.hideAllObjects();
		//objs[0].show();
		//console.log(objs[0].score);
		return objs;
	}
	calcDistante(obj1, obj2){
		let dlat = (obj1.lat > obj2.lat)?obj1.lat - obj2.lat:obj2.lat - obj1.lat;
		let dlong = (obj1.long > obj2.long)?obj1.long - obj2.long:obj2.long - obj1.long;

			// Distancia cartesiana
		let d = Math.sqrt(Math.pow(dlat, 2) + Math.pow(dlong, 2));
			// Distancia que considera a curvatura da terra
		let dCurva = 1.15 * 6371 *	Math.acos(Math.cos((Math.PI/180) * (90-obj1.lat))*Math.cos((Math.PI/180) * (90-obj2.lat))+Math.sin((Math.PI/180) * (90-obj1.lat))*Math.sin((Math.PI/180) * (90-obj2.lat))*Math.cos((Math.PI/180) * (obj1.long-obj2.long)));

		return parseFloat(dCurva.toFixed(2));
//		console.log(obj1.lat + ', ' + obj1.long);
//		console.log(obj2.lat + ', ' + obj2.long);
	}
}
 

