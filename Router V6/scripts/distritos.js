class Distritos{
	constructor(geojson = bairros){
		//this.nomeDosDistritosNormalizado = ['ÁGUA RASA', 'ALTO DE PINHEIROS', 'ARICANDUVA', 'ARTUR ALVIM', 'BARRA FUNDA', 'BELA VISTA', 'BELÉM', 'BOM RETIRO', 'BRÁS', 'BRASILÂNDIA', 'BUTANTÃ', 'CACHOEIRINHA', 'CAMBUCI', 'CAMPO BELO', 'CAMPO GRANDE', 'CAMPO LIMPO', 'CANGAIBA', 'CAPÃO REDONDO', 'CARRÃO', 'CASA VERDE', 'CIDADE ADEMAR', 'CIDADE DUTRA', 'CIDADE TIRADENTES', 'CONSOLAÇÃO', 'CURSINO', 'ERMELINO MATARAZZO', 'FREGUESIA DO Ó', 'GRAJAÚ', 'IPIRANGA', 'ITAIM BIBI', 'ITAIM PAULISTA', 'ITAQUERA', 'JABAQUARA', 'JAGUARA', 'JAGUARÉ', 'JARAGUÁ', 'JARDIM HELENA', 'JARDIM PAULISTA', 'JARDIM SÃO LUÍS', 'JOSÉ BONIFÁCIO', 'LAPA', 'LIBERDADE', 'LIMÃO', 'MANDAQUI', 'MOEMA', 'MOOCA', 'PARELHEIROS', 'PARI', 'PEDREIRA', 'PENHA', 'PERDIZES', 'PERUS', 'PINHEIROS', 'PIRITUBA', 'PONTE RASA', 'REPÚBLICA', 'RIO PEQUENO', 'SACOMÃ', 'SANTA CECÍLIA', 'SANTANA', 'SANTO AMARO', 'SÃO DOMINGOS', 'SÃO LUCAS', 'SÃO MATEUS', 'SAPOPEMBA', 'SAÚDE', 'SÉ', 'TATUAPÉ', 'TREMEMBÉ', 'TUCURUVI', 'VILA ANDRADE', 'VILA FORMOSA', 'VILA GUILHERME', 'VILA JACUÍ', 'VILA LEOPOLDINA', 'VILA MARIA', 'VILA MARIANA', 'VILA MATILDE', 'VILA MEDEIROS', 'VILA PRUDENTE', 'VILA SÔNIA'].map((d) => {return d.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()})
		this.distritos = [];
		this.mapa = L.map('map', {zoomControl: false}).setView([-23.555500310051162, -46.63212091504849], 10);
		this.geoMapa = [];
		this.stretsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		})
		
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
		let stats = {length: 0}
		let labels = ["tipo", "vazao", "situacao"];
		labels.map((label) => {
			stats[label] = {}
		})

		this.distritos.map((distrito) => {
			let distStats = distrito.getStatistics();

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
		let icons = [];

		objs.map((obj) => {
			icons.push(this.getIcon(obj.lat, obj.long).addTo(this.mapa).bindPopup("ID: " + obj.id));
		})

		return icons;
	}

	getIcon(lat, long, number = ''){
		var icon = L.divIcon({
			className: 'my-div-icon', 
			html: `<div><div id='icon-circle'>${number}</div><div id='icon-line'></div></div>`, 
			iconSize: [20, 31],
			iconAnchor: [10, 31],
			popupAnchor: [0, -55]
		});

		return  L.marker([lat, long], {icon: icon});
	}

	findLocation(lat, long){
		mapa.setView([lat, long]);
		let marker = L.marker([lat, long], {icon: icones['green']}).addTo(this.mapa);
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
		let countObjsNotLoad = 0;
		let countLoadedObjs = 0;

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
			let color = getColor(distrito.objects.length, maxObjectsCount);
			distrito.setStyle({color, opacity: 1, weight: 1, fillOpacity: .5});
		})	

		function getColor(a, b){
			let d = Math.floor(a/(b/5));

			return d > 4 ? '#000' :
	           d > 3  ? '#BD0026' :
	           d > 2  ? '#E31A1C' :
	           d > 1  ? '#FC4E2A' : '#0f8890';
		}
	}
}
 

