	var mapa = L.map('map').setView([-23.554844, -46.584188], 12);
	setTimeout(() => {
		//mapa.on('click', (event) => {handleMapClick(event)});
	}, 1000); 

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(mapa);


	let icones = {};
	let colors = ["red", 'blue', 'gray', 'green', 'marron', 'yellow', 'black'];
	var LeafIcon = L.Icon.extend({
			options: {
				iconSize:     [30, 30],
				iconAnchor:   [15, 30],
				popupAnchor:  [0, -35]
			}
		});
	for(let i = 0; i < colors.length; i++){

		icones[colors[i]] = new LeafIcon({iconUrl: `./mapIcons/${colors[i]}.png`});
	}
	function createIcon(lat, long, color, id, click = showId){

		return  L.marker([lat, long], {icon: icones[color]})
				.bindPopup(`Id` + id)
				.on('click', () => {click(id)});
	}
	function createCircle(lat, long){
		return L.circle([lat, long], {
	     	color: 'red',
	     	fillColor: '#f03',
	    	fillOpacity: 0.5,
	    	radius: 500,
		}).addTo(mapa);
	}
	function showId(it){
		
		console.log(geo.findObjByCod(it));
	}
	function findLocation(lat, long){
		mapa.setView([lat, long]);
		//let marker = L.marker([lat, long], {icon: redIcon}).addTo(mapa);
		let marker = createIcon(lat, long, 'gray', 'elvis').addTo(mapa);
	}