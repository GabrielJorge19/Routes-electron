class GeoQuadrantes{  
	constructor(countQuads, labels, data){ 
		this.countSubQuads = countQuads;
		this.data = data;
		this.indexList = {
			cod: 0,
			long: 1,
			lat: 2,
			value: 3,
			someInfo: 4,
			coluna: 5,
			rua: 6,
		};
		this.labels;
		this.setIndexList(labels);
		this.setBorders();

		// Verificar a criação de bordas
		// console.log("Objeto GeoQuadrantes criado !");
	}
	translate(word){
		let index = this.indexList[word];
		
		if(index != undefined){
			return index;
		} else {
			//alert("Error: to translate " + word + ", the answer was " + index);
			return -1;
		}
	}
	getIndexList(){

		return Object.keys(this.indexList);
	}
	setIndexList(labels){
		// add obligation of id, lat and long.
		// Essa função pode crachar todo o programa
		let indexList = {};

		for(let i = 0;i < labels.length;i++){
			indexList[labels[i]] = i;
		}

		this.indexList = indexList;
	}
	addNewIndex(label){

		this.indexList[label] = Object.keys(this.indexList).length;
	}
	setBorders(){
		let top = this.data[0][this.translate('lat')];
		let right = this.data[0][this.translate('long')];
		let bottom = top;
		let left = right;

		for(let i = 1; i < this.data.length;i++){

			let lat = this.data[i][this.translate('lat')];
			let long = this.data[i][this.translate('long')];

			top = (top < lat)?lat:top;
			right = (right < long)?long:right;
			bottom = (bottom > lat)?lat:bottom;
			left = (left > long)?long:left;
		}

		this.borders = {};
		this.borders.top = top;
		this.borders.right = right;
		this.borders.bottom = bottom;
		this.borders.left = left;

		this.buildSubQuads();
	}
	findObjByCod(cod){
		for(let i = 0; i < this.data.length;i++){
			if(this.data[i][this.translate('id')] == cod){
				return this.data[i];
			}
		}
		return -1;
	}
	getObjsByCods(cods){
		let objs = [];
		for(let i = 0; i < cods.length; i++){
			let obj = this.findObjByCod(cods[i]);
			if(obj){
				objs.push(obj);
			}
		}
		return objs;
	}
	removeObjByCode(objs, cod){
		let correctObjs = [];

		for(let i = 0; i < objs.length; i++){
			if(objs[i][this.translate('id')] != cod){
				correctObjs.push(objs[i]);
			}
		}

		return correctObjs;	
	}
	buildSubQuads(){
		this.subQuads = [];
		this.subQuadSizex = (this.borders.right - this.borders.left) / Math.sqrt(this.countSubQuads);
		this.subQuadSizey = (this.borders.top - this.borders.bottom) / Math.sqrt(this.countSubQuads);;

		
		let py = this.borders.top + this.subQuadSizey / 2;
		let count = 0;

		for(let i = 0; i < Math.sqrt(this.countSubQuads);i++){
			let px = this.borders.left + (this.subQuadSizex / 2) + (this.subQuadSizex * i);
			for(let o = 0; o < Math.sqrt(this.countSubQuads);o++){
				let py = this.borders.top - (this.subQuadSizey / 2) - (this.subQuadSizey * o);

				let subQuad = {
					itensCods: [],
					id: count,
					posX: px,
					posY: py,
				}

				this.subQuads.push(subQuad);
				count++;
			}
		}
		this.fillQuads();
	}
	fillQuads(){
		for(let i = 0; i < this.data.length; i++){
			this.findQuadByCoordenada(this.data[i][this.translate('lat')], this.data[i][this.translate('long')]).itensCods.push(this.data[i][this.translate('id')]);
		}
	}
	findQuadByCoordenada(lat, long){
		let betweenLat = ((lat >= this.borders.bottom) && (lat <= this.borders.top))?true:false;
		let betweenLong = ((long >= this.borders.left) && (long <= this.borders.right))?true:false;

		if(betweenLat && betweenLong){
			lat = this.subQuads[0].posY - lat;
			long = long - this.subQuads[0].posX;

			let line = parseInt(lat/this.subQuadSizey);
			let colunm = parseInt(long/this.subQuadSizex);
			let q = line * Math.sqrt(this.countSubQuads) + colunm;
			return this.subQuads[q];
		} else {
			return -1;
		}
	}
	decimalToGraus(lat, long){
		let latSentido = "S";
		let longSentido = "W";

		lat = (lat < 0)?lat*-1:lat;
		long = (long < 0)?long*-1:long;

		let latDegrees = parseInt(lat);
		let latMinutes = (lat - latDegrees) * 60;
		let latSeconds = ((latMinutes - parseInt(latMinutes)) * 60);

		let longDegrees = parseInt(long);
		let longMinutes = (long - longDegrees) * 60;
		let longSeconds = ((longMinutes - parseInt(longMinutes)) * 60);

		let latGraus = latDegrees + "°" + latMinutes.toFixed(0) + "'" + latSeconds + '"' + latSentido;
		let longGraus = longDegrees + "°" + longMinutes.toFixed(0) + "'" + longSeconds + '"' + longSentido;

		// console.log(latGraus, longGraus);

		return latGraus, longGraus;
	}
	calculateDistance(place1, place2){

		let degreesToRad = Math.PI/180;

		let distante = 7326.65 * 
			Math.acos(
				Math.cos(degreesToRad * (90-place1[0])) *
				Math.cos(degreesToRad * (90-place2[0])) +
				Math.sin(degreesToRad * (90-place1[0])) *
				Math.sin(degreesToRad * (90-place2[0])) *
				Math.cos(degreesToRad * (place1[1]-place2[1]))
			);

		// console.log(distante);
		return distante;
	}
	calculateDistanceByObjs(obj1, obj2){
		let place1 = [obj1[this.translate('lat')], obj1[this.translate('long')]];
		let place2 = [obj2[this.translate('lat')], obj2[this.translate('long')]];
		return this.calculateDistance(place1, place2);
	}
	whichIsCloser(lat, long, objs){
		if(objs.length > 0){
			let nextObj = {
				index: 0,
				distance: this.calculateDistance([lat, long], [objs[0][this.translate('lat')], objs[0][this.translate('long')]]),
			}
			for(let i = 1; i < objs.length; i++){
				let distance = this.calculateDistance([lat, long], [objs[i][this.translate('lat')], objs[i][this.translate('long')]]);
				if(distance < nextObj.distance){
					nextObj.distance = distance;
					nextObj.index = i;
				}
			}
			return objs[nextObj.index];
		} else {
			return -1;
		}
	}

	// será depreciada em breve.
	findNextObjByCod(cod){
		let obj = this.findObjByCod(cod);
		let objs = this.removeObjByCode(this.findNextObjsByCod(cod, 1,), cod);

		return this.whichIsCloser(obj[this.translate('lat')], obj[this.translate('long')], objs);
	}
	findNextObjsBylocation(lat, long, minCount = 1){
		// Essa função encontra os objetos proximos por meio dos quadrante.
		// Sendo assim não é possivel passar os objetos que ela irá usar.
		let centerQuad = this.findQuadByCoordenada(lat, long);
		let objs = this.getObjsByQuadCod([centerQuad.id]);

		for(let i = 1; i < Math.sqrt(this.countSubQuads);i++){
			let objects = this.getObjsByQuadCod(this.getNextsQuads(centerQuad.id, i));
			for(var x in objects){objs.push(objects[x]);}
			if(objs.length > minCount){i = Math.sqrt(this.countSubQuads);}
		}
		return objs;
	}
	findObjsByDistance(objs, lat, long, distance = null){
		let closeObjs = objs.map((obj) => {
			let cordenate = [obj[geo.translate('lat')], obj[geo.translate('long')]];
			let distance = this.calculateDistance(cordenate, [lat, long]);
			return {
				distance: Number(distance.toFixed(3)), 
				obj: obj
			};
		});

		if(distance != null){
			closeObjs = closeObjs.filter((obj) => {
				return obj.distance < distance;
			});
		}

		closeObjs = closeObjs.sort((a, b) => {
			return a.distance - b.distance;
		});

		return closeObjs;
	}
	findNextObjsByCod(cod, minCount = 0){
		let obj = this.findObjByCod(cod);
		let objs = this.findNextObjsBylocation(obj[this.translate('lat')], obj[this.translate('long')], minCount);
		objs = this.removeObjByCode(objs, cod);
		return objs;
	}
	filterObjs(objs, filters, operation, values){
		let correctObjs = [];
		let w = 0;
		//console.log(values);

		for(let i = 0;i < objs.length;i++){
			let obj = objs[i];
			let objAproved = true;

				for(let o = 0;o < filters.length; o++){
					let filterCond = true;
					for(let u = 0;u < values[o].length; u++){
						
						let objectValue = obj[this.translate(filters[o])];
						let valor = values[o][u];

						switch(operation[o]){
							case 'equal':
								if(objectValue != valor){filterCond = false}
							break;
							case 'diferent':
								if(objectValue == valor){filterCond = false}
							break;
							case 'more':
								if(objectValue <= valor){filterCond = false}
							break;
							case 'less':
								if(objectValue >= valor){filterCond = false}
							break;
						}
					}
					if(!filterCond){objAproved = false;}
				}
					
			if(objAproved){correctObjs.push(obj)
				//if(operation[1] == 'diferent'){console.log(obj, filters, operation, values)}
			}
		}
		return correctObjs;
	}
	getNextsQuads(quad, distance = 1){
		let quads = [];
		let size = Math.sqrt(this.countSubQuads);
		let line = Math.floor(quad/size);
		let colunm = quad%size;

		for(let i = -distance; i <= distance; i++){
			let line1 = line - distance;
			let line2 = line + distance;
			let coluna = colunm + i;
			
			if(0 <= coluna && coluna < size){
				if(0 <= line1 && line1 < size){quads.push(line1 * size + coluna);}
				if(0 <= line2 && line2 < size){quads.push(line2 * size + coluna);}			
			}

			if((i > -distance) && (i < distance)){
				let colunm1 = colunm - distance;
				let colunm2 = colunm + distance;
				let linha = line + i;
				
				if(0 <= linha && linha < size){
					if(0 <= colunm1 && colunm1 < size){quads.push(linha * size + colunm1);}
					if(0 <= colunm2 && colunm2 < size){quads.push(linha * size + colunm2);}		
				}
			}
		}

		return quads.sort((a,b) => a-b)
	}
	getObjsByQuadCod(quadsCods){
		let objs = [];
		for(let i = 0;i < quadsCods.length;i++){
			let quad = this.subQuads[quadsCods[i]];
			for(let o = 0;o < quad.itensCods.length;o++){
				objs.push(this.findObjByCod(quad.itensCods[o]));
			}
		}
		return objs;
	}
	exportObjsAsCsv(objs, coluns, separator){
		let csv = coluns[0];

		for(let o = 1;o < coluns.length; o++){
			csv += separator + coluns[o];
		}

		for(let i = 0;i < objs.length;i++){
			let obj = objs[i];
			csv += "\n";
			csv += obj[this.translate(coluns[0])];

			for(let o = 1;o < coluns.length; o++){
				let value = obj[this.translate(coluns[o])];
				value = (value != undefined)?value:"vazio"
				csv += separator + value;
			}
		}

		return csv;
	}
	setValue(objs, coluns, values){
		for(let i = 0;i < objs.length;i++){
			let obj = objs[i];
			for(let o = 0;o < coluns.length; o++){
				if(this.translate(coluns[o]) != -1){
					obj[this.translate(coluns[o])] = values[o];
				}
			}

		}
	}
	order(objs, colum, ordem = 'crescente'){
		let ordenado = false;
		let tipoDeDado = typeof(objs[0][this.translate(colum)]);

		if(tipoDeDado == "number"){
			let label = this.translate(colum);
			objs.sort(function (a, b) {
				return (a[label] > b[label]) ? 1 : ((b[label] > a[label]) ? -1 : 0);
			});
		} else if(tipoDeDado == "string"){
			let label = this.translate(colum);
			objs.sort(function (a, b) {
				// SE O PRIMEIRO VALOR FOR UNDEFINED A FUNÇÃO NÃO IRÁ FUNCIONAR
				let r = (a[label] > b[label]) ? 1 : ((b[label] > a[label]) ? -1 : 0);
				r = (a[label] != undefined)?r:1;
				r = (b[label] != undefined)?r:-1;
				return r;
			});
		}

		if(ordem == 'crescente'){
			return objs;
		} else if(ordem == 'decrescente'){
			return inverterOrdem(objs);
		}

		function inverterOrdem(objs){
			let size = objs.length;

			for(let i = 0; i < size/2; i++){
				let obj = objs[i];

				objs[i] = objs[size - 1 - i];
				objs[size -1 - i] = obj;
			}

			return objs;
		}
	}
	sortByProximity(lat, long, objs){

		console.log("Função sortByProximity ainda em desenvolvimento");
	}
	mapOptions(label){
		let index = this.translate(label);
		let options = [];

		if(index){
			for(let i = 0; i < this.data.length; i++){
				let optionsAdded = false;

				for(let o = 0; o < options.length; o++){
					if(options[o] == geo.data[i][index]){
						optionsAdded = true;
					}
				}

				if(!optionsAdded){
					if(options.length > 15){
						return [];
					} else {
						options.push(geo.data[i][index]);
					}
				}
			}
		} else {
			return [];
		}
		return options;
	}
}
