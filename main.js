$(function() {

var minZoom = 15,
	map = new L.Map('map', {
		attribution: '<a href="http://leafletjs.com/">Leaflet</a> &bull; <a href="http://osm.org/" target="_blank">OpenStreetMap contributors</a>',
		layers: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
		minZoom: minZoom
	}),
	//overpassUrl= 'http://overpass.osm.rambler.ru/cgi/interpreter?'
	overpassUrl= 'http://overpass-api.de/api/interpreter?';

map.setView(L.latLng(42.4461,12.4937), minZoom);

var geoLayer = L.geoJson([]).addTo(map);

var users = {};

window.users = users;

L.layerJSON({
	//http://overpass-turbo.eu/s/3Ml
	//(node();way["highway"~"."]();>;);out meta;
	//way["highway"~"."]({lat1},{lon1},{lat2},{lon2});>;out meta;
	url: overpassUrl+'data=[out:json];way["highway"~"."]({lat1},{lon1},{lat2},{lon2});>;out meta;',
	propertyItems: 'elements',
	propertyTitle: 'tags.name',
	propertyLoc: ['lat','lon'],
	dataToMarker: function(data,ll) {
		//console.log(data);
		if(!users[data.user])
			users[data.user] = [];
		else
			users[data.user].push(ll);

		return false;//L.circle(ll, 10);
	}
})
// .on('dataloading',function(e) {
// 	console.log('dataloading',e);
// 	//loader.style.display = 'block';
// })
.on('dataloaded',function(e) {
	console.log('dataloaded', users);
	//loader.style.display = 'none';
	
	for(var username in users)
	{
		var color = rgb2hex(randcolorhue([0,0,255]));
		console.log(username, color, users[username].length);

		geoLayer.addData( L.polygon(users[username], {color: color }).toGeoJSON() );
	}
})
.addTo(map);

//CONTROL SIDEBAR
//L.control.sidebar('sidebar',{position:'right', autoPan:false}).addTo(map).show();

});

