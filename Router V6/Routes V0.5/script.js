let hidrantes = [];   
let grupos = [];
let map = {
	countQuads:16,
	quadLatSize: null,
	quadLongSize: null,
	quadrantes: [],   
	// borders: {
	// 	top: -23.550446513644883,	// lat +
	// 	right: -46.63390919745432, // long +
	// 	bottom: -23.550446513644881, // lat - 
	// 	left: -46.63390919745430,	// long -
	// },
	borders: {
		top: null,	// lat +
		right: null, // long +
		bottom: null, // lat -
		left: null,	// long -
	},
}

let table = {
	showLabels: ["id", "lat", "long", "data"],
	coluns: [{
		name: "id",
		surname: "Id",
		display: true,
	}]
}

function configMap(){
	console.log("configMap");

	function defineQuadBorders(){
		for(let i = 0; i < hidrantes.length;i++){

			let lat = hidrantes[i].lat;
			let long = hidrantes[i].long;

			map.borders.top = ((map.borders.top < lat) || (map.borders.top == null))?lat:map.borders.top;
			map.borders.right = ((map.borders.right < long) || (map.borders.right == null))?long:map.borders.right;
			map.borders.bottom = ((map.borders.bottom > lat) || (map.borders.bottom == null))?lat:map.borders.bottom;
			map.borders.left = ((map.borders.left > long) || (map.borders.left == null))?long:map.borders.left;

			// console.log(map.borders.top < lat, map.borders.right < long, map.borders.bottom > lat, map.borders.left > long);
			// console.log((map.borders.top < lat) || (map.borders.top == null));
		}

		setTimeout(function(){
			createSubQuads();
		}, 100);
	}

	defineQuadBorders();

	function createSubQuads(){
		let countLineQuad = Math.sqrt(map.countQuads);

		map.quadLatSize = (map.borders.top - map.borders.bottom) / countLineQuad;
		map.quadLongSize =  (map.borders.right - map.borders.left) / countLineQuad;

		for(let line = 0;line < countLineQuad;line++){
			
			let top = map.borders.top - (map.quadLatSize * line);

			for(let colun = 0;colun < countLineQuad;colun++){
				let left = map.borders.left + (map.quadLongSize * colun);

				let quadrante = {
					id: map.quadrantes.length,
					borders: {
						top: top,
						right: (left + map.quadLongSize),
						bottom: (top - map.quadLatSize),
						left: left,
					},
					hids: [],
				}

				map.quadrantes[map.quadrantes.length] = quadrante;
			}
		}
		moveHidsToQuadrantes();
	}
}







function moveHidsToQuadrantes(){
	for(let i = 0;i < hidrantes.length;i++){
		let lat = hidrantes[i].lat;
		let long = hidrantes[i].long;
		let lineSize = Math.sqrt(map.countQuads);

		let a = Math.floor((map.borders.top - lat) / map.quadLatSize);
		let b = Math.floor((long - map.borders.left) / map.quadLongSize);

		a = (a == lineSize)?lineSize-1:a;

		let q = (a * lineSize) + b;

		q = (q>=map.countQuads)?map.countQuads-1:q;


		let validLat = ((map.quadrantes[q].borders.bottom <= lat) && (lat <= map.quadrantes[q].borders.top));
		let validLong = ((map.quadrantes[q].borders.left <= long) && (long <= map.quadrantes[q].borders.right));

		// console.log(i, q, validLat, validLong);

		map.quadrantes[q].hids.push(hidrantes[i]);
	}

	hidrantes = [];
	setTimeout(function(){
		changeViews("mapaIcom");
	}, 200);
}













// 		Dom events
	setTimeout(function(){

	document.getElementById('importButton').addEventListener('click', () => {changeViews("importIcom")});
	document.getElementById('exportGroups').addEventListener('click', views[4].export);
	// document.getElementById('preview').addEventListener('click', readFile);
	document.getElementById('refheshPreview').addEventListener('click', views[5].previewData);
	document.getElementById('importFile-button').addEventListener('click', views[5].proccedFile);
  document.getElementById('requestGroupsViewIcon').addEventListener('click', renderRequestGroups);
	
	}, 100);

	let icomViews = document.getElementsByClassName('iconViews');
	for(let i = 0;i < icomViews.length; i++){
		let icomId = icomViews[i].id;
		icomViews[i].addEventListener('click', function(){
			changeViews(icomId);
		});
	}


// 		Visual functions
	let views = [{
			viewId: "table",
			},{
			viewId: "quadrantes",
			icomId: "quadrantesIcom",
			statistic: {
				done: false,
				maxHidPerQuad: 0,
				classes: [],
			},
			info: {
				object: document.getElementById("quadInfo"),
				display: false,
				top: 0,
				left: 0,
				quad: 0,
				countHids: 0,
				render: function(obj){
					let id = obj.id;
					this.quad = id.slice(id.indexOf("-") + 1);
					this.countHids = map.quadrantes[this.quad].hids.length;

					let positions = obj.getBoundingClientRect();
					this.left = positions.left;
					this.top = positions.top + 30;

					let html = `
					    <h1>Quadrante ${this.quad}</h1>
					    <p>${this.countHids} hidrates</p>
				  	`;

				  this.object.innerHTML = html;
				  this.object.style.top = this.top + "px";
				  this.object.style.left = this.left + "px";
				  this.object.style.display = "block";	
				},
				hide: function(obj){

					this.object.style.display = "none";
				}
			},
			genereteStatistic: function(){
			
				for(let i = 0;i < 10;i++){
					let classe = {
						init: Math.floor((this.statistic.maxHidPerQuad / 10) * i + 1),
						end: Math.floor((this.statistic.maxHidPerQuad / 10) * (i + 1)),
						count: 0,
					}
					this.statistic.classes[i] = classe;
				}

				for(let o = 0;o < map.quadrantes.length; o++){
					let n = map.quadrantes[o].hids.length;

					if(n > 0){
						let classNumber = Math.floor(n / (this.statistic.maxHidPerQuad / 10));
						classNumber = (classNumber > 9)?9:classNumber;
						this.statistic.classes[classNumber].count++;
					}
				}
				console.log("genereteStatistic");
			},
			quadClick: function(obj){
				let id = obj.id;
				id = parseInt(id.slice(id.indexOf("-") + 1));

				let size = 4;

				let array = map.quadrantes[id].hids;
				let lineCount = Math.sqrt(map.quadrantes.length);
				let quads = [];

				for(let i = -1;i < 2;i++){
					for(let o = -1;o < 2;o++){
						let data = id + lineCount * i + o;
						quads.push(data);
					}
				}				

				// console.log(quads);

				makeGroups(array, size);
				// console.log("Criado grupo");
				// popUp.createPopUp({type: "default", title: "Grupo criado", body: `Grupo criado no quadrante ${id} com ${size}`});
			},
			render: function(){
					let quadrante = document.getElementById("quadMap");
					document.getElementById(this.viewId).style.display = "block";
				if(map.quadrantes.length > 0){
					let subQuadWidth = quadrante.clientWidth/Math.sqrt(map.countQuads);
					let subQuadHeight = quadrante.clientHeight/Math.sqrt(map.countQuads);
					
					if(map.maxQuadCount == undefined){
						map.maxQuadCount = map.quadrantes[0].hids.length;

						for(let o = 1;o < map.quadrantes.length;o++){
							let a = map.quadrantes[o].hids.length;
							map.maxQuadCount = (map.maxQuadCount < a)?a:map.maxQuadCount;
						}
					}

					let html = "";
					let style = `
							width: ${subQuadWidth};
							height: ${subQuadHeight};
							float: left`;
					
					let max = 0;

					for(let i = 0;i < map.quadrantes.length;i++){
						
						max = (map.quadrantes[i].hids.length > max)?map.quadrantes[i].hids.length:max;

						let tom = (map.quadrantes[i].hids.length * 150) / map.maxQuadCount;
						tom = (tom == 0)?255:150 - tom;
						// tom = 255 - 10 * i;

						html += `
							<div onclick="views[1].quadClick(this)" onmouseover="views[1].info.render(this)" onmouseout="views[1].info.hide(this)" style="${style};background-color: rgb(${tom}, ${tom}, ${tom});" id="subQuad-${i}" class="subQuad"></div>
						`;
					}

					quadrante.innerHTML = html;
					console.log("Quadrantes renderizados");
					this.statistic.maxHidPerQuad = max;

					this.genereteStatistic();
				} else {
					console.log("Não há quadrantes");
				}
			}
		},{
			viewId: "mapa",
			icomId: "mapaIcom",
			render: function(){
				
				document.getElementById('mapa').style.display = "block";
				// console.log("Mapa não existe");
			}
		},{
			viewId: "quadList",
		},{
			viewId: "group",
			icomId: "groupIcom",
			makeGroups: function(){
				
				console.log("Doing groups");
			},
			render: function(){

				this.renderMakeGroups();
				this.renderGroups();
			},
			renderMakeGroups: function(){
				document.getElementById(this.viewId).style.display = "block";

				let html = `<h1>quadrantes</h1><table><tr><th>range</th><th>count</th><th>generate</th></tr>`

				for(let i = 0;i < views[1].statistic.classes.length;i++){
					let clas = views[1].statistic.classes[i];	
					html += `<tr><td>${clas.init} - ${clas.end}</td><td>${clas.count}</td><td><input type="number" class="makeGroupInput" value="0"></td></tr>`
				}

				html += `</table><p>Quantidade por grupo</p><input type="number" id="countPerGroup" value="3"><button onclick="views[4].makeGroups()">Gerar grupos</button>`;

				document.getElementById("makeGroups").innerHTML = html;
			},
			renderGroups: function(){
				let html = `<div class="line title">
					<p>Id</p>
					<p>Hidrantes</p>
					<p>distancia</p>
				</div>`;

				if(grupos.length > 0){
					html += '<div id="dataList">';
					let colors = ["ffd36e", "e3fcff"];

					for(let i = 0; i < grupos.length;i++){
						let cor = (i%2 == 0)?colors[0]:colors[1];
						cor = `style="background-color:#${cor}"`;

						// cor = "";

						html += `<div ${cor} class="data"><p>${grupos[i].id}</p><p>`;

						for(let o = 0;o < grupos[i].ids.length;o++){
							html += grupos[i].ids[o];
							html += (o+1 < grupos[i].ids.length)?"-":"";
						}

						html += `</p><p>${Math.floor(grupos[i].distance)} Km</p></div>`;
					}
					html += '</div>';
				} else {
					html += `<div class="line vazio">
						Não há nenhum valor para exibir
					</div>`;
				}

				// document.getElementById("dataList").innerHTML = html;
				document.getElementById("listGroup").innerHTML = html;

				console.log("rendering groups");
			},
			export: function(){
				let separador = document.getElementById("valueDivisor").value;
				if(grupos.length == 0){
					alert("Não há grupos para exportar");
				} else {

					let csv = 'hidrantes' + separador + 'grupo\n';

					for(let i = 0;i < grupos.length;i++){

						for(let o = 0;o < grupos[i].ids.length;o++){
							csv += grupos[i].ids[o] + separador + grupos[i].id + '\n';
						}
					}

					var hiddenElement = document.createElement('a');
	    		hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
			    hiddenElement.target = '_blank';
			    hiddenElement.download = 'gdgExport.csv';
			    hiddenElement.click();

					console.log("exporting");
				}
			}
		},{
			viewId: "import",
			icomId: "importIcom",
			render: function(){
				document.getElementById("import").style.display = "block";
				console.log("Import existe");
			},
			previewData: function(){
				let lineDivisor = document.getElementById("lineDivisor").value;
				lineDivisor = lineDivisor.replace('\\n', `\n`);
				let valueDivisor = document.getElementById("valueDivisor").value;
				// console.log(this.data.length, lineDivisor);
				let lines = views[5].data.split(lineDivisor);
				let labels = lines[0].split(valueDivisor);

				let valueOne = lines[1].split(valueDivisor);

				let html = `<div class="previewLine">`;

				for(let o = 0;o < labels.length;o++){
					html += `<p>${labels[o]}</p>`;
				}
					
				html += "</div>";

				for(let i = 1;i < 11;i++){
					let line = lines[i].split(valueDivisor);

					html += `<div class="previewLine">`;

					for(let u = 0;u < line.length;u++){
						html += `<p>${line[u]}</p>`;
					}
					
					html += "</div>";
				}

				document.getElementById("previewTable").innerHTML = html;
			},
			proccedFile: function(){

				createJson(views[5].data);
			}
	},{
			viewId: "debug",
	}]

	function changeViews(icomId){
		for(let i = 0;i < views.length;i++){
			
			if(views[i].icomId == icomId){
				views[i].render();
			} else {
				document.getElementById(views[i].viewId).style.display = "none";
			}

		}
	}

	function renderRequestGroups(){
	  document.getElementById('requestGroups').style.display = "block"; 
    document.getElementById('mapa').style.display = "none"; 
	}

	function cancelRequestGroups(){
    
    document.getElementById('requestGroups').style.display = "none"; 
    document.getElementById('mapa').style.display = "block"; 
  }
  function requestGroups(){
  	let grups = parseInt(document.getElementById('grupsCount').value);
    let grupsSize = parseInt(document.getElementById('grupsSize').value);
    let groupsCount = 0;

    for(let u = 0;u < map.quadrantes.length;u++){
    	if(groupsCount >= grups){
    		u = map.quadrantes.length;
    	} else {
	    	let line = parseInt((Math.random() * (Math.sqrt(map.quadrantes.length) - 2)) + 1);
	    	let colunm = parseInt((Math.random() * (Math.sqrt(map.quadrantes.length) - 2)) + 1);

	    	let id = line * Math.sqrt(map.quadrantes.length) + colunm;

	    	let array = [];
				let lineCount = Math.sqrt(map.quadrantes.length);
				let quads = [];

				for(let i = -1;i < 2;i++){
					for(let o = -1;o < 2;o++){
						let data = id + lineCount * i + o;
						for(let j = 0;j < map.quadrantes[data].hids.length;j++){
							array.push(map.quadrantes[data].hids[j]);
						}
					}
				} 

				if(array.length > grupsSize){
					groupsCount++;
					makeGroups(array, grupsSize);
				}
			}		
    }

    // alert(grups + " grupos de " + grupsSize);
  }

var reader = new FileReader();

function readFile(){
  let a = document.getElementById('dados');
  reader.readAsDataURL(a.files[0]);
  setTimeout(function(){
		let q = (reader.result).split(',');
		views[5].data = atob(q[1]);
		views[5].previewData();
  }, 1000);  
}

function createJson(string){
	let lineDivisor = document.getElementById("lineDivisor").value;
	lineDivisor = lineDivisor.replace('\\n', `\n`);
	string = string.replaceAll('\r', ``);
	let valueDivisor = document.getElementById("valueDivisor").value;

	hidrantes = [];
  let numberLabels = ["id", "lat", "long"];
  let lines = string.split(lineDivisor);
  let Jason = {
    labels: lines[0].split(valueDivisor),
    lines: [],
  };
  	
  for(let i = 1;i < lines.length-1; i++){
  	let line = lines[i].split(valueDivisor);
  	let hid = {
  		state: 0, 
  		group: null
  	};

  	for(let o = 0; o < line.length; o++){
  		let label = Jason.labels[o];
  		let value = line[o];

  		for(let u = 0;u < numberLabels.length; u++){
  			if(numberLabels[u] == label){
  				value = parseFloat(value);
  			}
  		}
  		hid[label] = value;
  	}
      hidrantes[i-1] = hid; 
  }
  configMap();
}

function calculateDistance(place1, place2){
	let x = place1.lat;
	let y = place1.long;
	
	let a = place2.lat;
	let b = place2.long;

	let d = Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
	// console.log(x + ", " + y);
	// console.log(a + ", " + b);

	const grausToKm = 108.783587843;
	// console.log(d*grausToKm);
	let raio = 6371;
	let fatorAjuste = 1;
	let degreesToRad = Math.PI/180;

	let qq = 1.15 * raio *	Math.acos(Math.cos(degreesToRad * (90-x))*Math.cos(degreesToRad * (90-a))+Math.sin(degreesToRad * (90-x))*Math.sin(degreesToRad * (90-a))*Math.cos(degreesToRad * (y-b)));
	//=raio*ACOS(COS(RADIANOS(90-latitude_1))*COS(RADIANOS(90-latitude_2))+SEN(RADIANOS(90-latitude_1))*SEN(RADIANOS(90-latitude_2))*COS(RADIANOS(longitude_1-longitude_2))*fator_ajuste)
	return qq;
}
function makeGroups(hids, size, init = null){
	let ended = false;

	for(let i = 0; i < hids.length; i++){

			let group = {
				id: grupos.length,
				ids: [],
				distance: 0,
				hids: [],
			};

			if(hids[i].id == init){
				if(hids[i].state != 0){
					console.log("hidrante inicial já agrupado");
					i = hids.length;
				} else {
					group.ids.push(hids[i].id);
					group.hids.push(hids[i]);
					hids[i].state = 1;
					hids[i].group = group.id;
				}
			} else if(init == null){
				if(hids[i].state == 0){
					group.ids.push(hids[i].id);
					group.hids.push(hids[i]);
					hids[i].state = 1;
					hids[i].group = group.id;
				}
			}


			if(group.hids.length > 0){
				for(let u = 1; u < size; u++){
						let next = {
							id: null,
							distance: null,
							index: null
						}

						ended = true;

						for(let o = 0;o < hids.length;o++){
							if(hids[o].state == 0){
								ended = false;
								let d = calculateDistance(hids[group.hids.length -1], hids[o]);
								if((d < next.distance) || (next.distance == null)){
									next.distance = d;
									next.id = hids[o].id;
									next.index = o;
								}
							}
						}

						if(!ended){
							hids[next.index].state = 1;
							hids[next.index].group = group.id;
							group.ids.push(next.id);
							group.hids.push(hids[next.index]);
							group.distance += next.distance;
						} else {
							o = hids.length;
							u = size;
							i = hids.length;
						}
					}

					o = hids.length;
					u = size;
					i = hids.length;
					
					if(group.hids.length == size){
						grupos.push(group);
						console.log("Grupo criado");
					} else {
						console.log("Não há hidrantes suficientes", group);
					}
				}		
	}
	// return grupos;
}

function countHidsInQuad(q){
		// Essa função contra a quatidade de quadrantes com menos do que "q" hidrantes 
		// maior que 0, ou seja 			q > quadHids > 0.

    let a = 0
        
    for(let i = 0; i < map.quadrantes.length;i++){    
        let c = map.quadrantes[i].hids.length;
        if((c < q) && (c > 0)){
            a++;
        }
    }

    console.log("Há " + a + " quadrantes com menos de " + q + " hidrantes");
}

function changeBack(a = 50){
	let obj = document.getElementsByTagName('body')[0];

	// obj.style.backgroundImage = `linear-gradient(to bottom right, black ${a-10}%, white ${a}%, black ${a+10}%)`;
	obj.style.backgroundImage = `linear-gradient(to right, white ${a-10}%, rgba(59, 255, 216, .1) ${a}%, rgba(59, 255, 216, .3) ${a+10}%, white ${a+10}%)`;
	// obj.style.backgroundImage = `linear-gradient(to bottom right, black ${a-10}%, #616161 ${a+1}%, white ${a+10}%, black ${a+10}%)`;
	setTimeout(function(){
		let na = a+.01;
		if(na < 110){
  			changeBack(na);
		} else {
			changeBack(-10);
		}
	}, 10);
}

function convert(a){
  let = degrees = parseInt(a);
  let minutes = (a - degrees) * 60;
  let seconds = ((minutes - parseInt(minutes)) * 60);
	console.log(degrees, minutes, seconds);
}

changeBack();

setTimeout(function(){
	changeViews("mapaIcom");
	window.dispatchEvent(new Event('resize'));


	// let data = [
	// 	[1,-46.63204506598758,-23.544100285078514, 31, ''],
	// 	[2,-46.63278705891655,-23.54825092245447, 7, "cod 2"],
	// 	[3,-46.633212870417346,-23.5484252630258, 4, 'gabriel'],
	// 	[4,-46.607260902693255,-23.59771360353663, 2, "tarara"],
	// 	[5,-46.66394403386473,-23.556775238087518, 7, 'gabriel'],
	// 	[6,-46.57465691406712,-23.597089726460435, 2, ''],
	// 	[7,-46.623755400418595,-23.563665183792736, 7, ''],
	// 	[8,-46.62310389285146,-23.575109162347008, 10, "tenso"],
	// 	[9,-46.623487327836315,-23.5767839706719, 30, "favor"],
	// 	[10,-46.62348566249278,-23.57531055671406, 10, '']];

	// geo = new GeoQuadrantes(100, data);
}, 100);

// let geo;