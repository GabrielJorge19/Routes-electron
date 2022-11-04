let dis = ['ÁGUA RASA', 'ALTO DE PINHEIROS', 'ARICANDUVA', 'ARTUR ALVIM', 'BARRA FUNDA', 'BELA VISTA', 'BELÉM', 'BOM RETIRO', 'BRÁS', 'BRASILÂNDIA', 'BUTANTÃ', 'CACHOEIRINHA', 'CAMBUCI', 'CAMPO BELO', 'CAMPO GRANDE', 'CAMPO LIMPO', 'CANGAIBA', 'CAPÃO REDONDO', 'CARRÃO', 'CASA VERDE', 'CIDADE ADEMAR', 'CIDADE DUTRA', 'CIDADE TIRADENTES', 'CONSOLAÇÃO', 'CURSINO', 'ERMELINO MATARAZZO', 'FREGUESIA DO Ó', 'GRAJAÚ', 'IPIRANGA', 'ITAIM BIBI', 'ITAIM PAULISTA', 'ITAQUERA', 'JABAQUARA', 'JAGUARA', 'JAGUARÉ', 'JARAGUÁ', 'JARDIM HELENA', 'JARDIM PAULISTA', 'JARDIM SÃO LUÍS', 'JOSÉ BONIFÁCIO', 'LAPA', 'LIBERDADE', 'LIMÃO', 'MANDAQUI', 'MOEMA', 'MOOCA', 'PARELHEIROS', 'PARI', 'PEDREIRA', 'PENHA', 'PERDIZES', 'PERUS', 'PINHEIROS', 'PIRITUBA', 'PONTE RASA', 'REPÚBLICA', 'RIO PEQUENO', 'SACOMÃ', 'SANTA CECÍLIA', 'SANTANA', 'SANTO AMARO', 'SÃO DOMINGOS', 'SÃO LUCAS', 'SÃO MATEUS', 'SAPOPEMBA', 'SAÚDE', 'SÉ', 'TATUAPÉ', 'TREMEMBÉ', 'TUCURUVI', 'VILA ANDRADE', 'VILA FORMOSA', 'VILA GUILHERME', 'VILA JACUÍ', 'VILA LEOPOLDINA', 'VILA MARIA', 'VILA MARIANA', 'VILA MATILDE', 'VILA MEDEIROS', 'VILA PRUDENTE', 'VILA SÔNIA'];
dis = dis.map((d) => {
	return d.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
})





// <div><p id="vazao">0</p><span>Média</span></div>

class Distrito{
	
	constructor(geojson){

	}
}









class Distritos{
	constructor(mapa, geojson = bairros){
		this.distritos = {};
		this.distritosNomes = [];
		this.mapa = mapa;
		this.geoMapa = [];
		this.statistcs = {};


		this.initDistricts(geojson);
		console.log('Class Noo loaded!');
	}	

	initDistricts(geojson){
		
		
	
		function onEachFeature(feature, layer) {
			function zoomToFeature(e){
				let distName = e.target.feature.properties.NOME_DIST.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
				//console.log(clase.distritos[distName]);
				displayDistStat(distName);
			    clase.mapa.fitBounds(e.target.getBounds());
			}
			function resetHighlight(e) {
			    
			    //clase.geoMapa.resetStyle(e.target);
			}
			function highlightFeature(e){
			    var layer = e.target;

			    layer.setStyle({
			        weight: 5,
			        color: '#666',
			        dashArray: '',
			        fillOpacity: 0.2,
			    });

			    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			        layer.bringToFront();
			    }
			}

		    layer.on({
		        mouseover: highlightFeature,
		        mouseout: resetHighlight,
		        click: zoomToFeature
		    });

		}

		for(let i in geojson.features){
			let geo = geojson.features[i];
			let distrito = {
				...geo.properties,
				feature: geo,
				objects: [],
			}

			var myStyle = {
				"color": (i%2 == 0)?"#ff7800":"#427ef5",
				"weight": 2,
				"opacity": 0.65
			};

			if(i < 10){
				this.geoMapa.push(L.geoJSON(geo, {style: myStyle, onEachFeature: onEachFeature}).addTo(this.mapa));

			}
			let distName = geo.properties.NOME_DIST.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

			this.distritos[distName] = distrito;
			this.distritosNomes.push(distName);
		}

		

		let clase = this; 
		//this.geoMapa = L.geoJSON(geojson, {style: myStyle, onEachFeature: onEachFeature}).addTo(this.mapa);
	}

	drawDistrict(){
		L.geoJSON(geojsonFeature).addTo(map);
	}

	loadObjects(objects){
		let countObjsNotLoad = 0;
		let countLoadedObjs = 0;

		for(let id in objects){
			let obj = objects[id];
			let distrito = obj.distrito.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
			let dist = this.distritos[distrito];

			// o texto do distrito nao é normalizado a tempo e os valores considerados são os valores com acentos
			// obs: a função funcioa


			if(dist){
				dist.objects[id] = obj;
				countLoadedObjs++;
			} else {
				countObjsNotLoad++;
				//console.log("ERRO: " + distrito);
			}
		}

		let distritos = Object.keys(this.distritos);
		for(let i in distritos){
			this.calcStatistics(distritos[i]);
		}
		console.log("Loaded " + countLoadedObjs + " and not loaded: " + countObjsNotLoad);
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
 

let bad;
setTimeout(() => {
	bad = new Distritos(mapa, bairros);
}, 200); 

setTimeout(() => {
	bad.loadObjects(objects);
}, 400); 


//	bad.geoMapa._layers[21].setStyle({color: '#000'});