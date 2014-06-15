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

// var dt = new Date();
// dt.setMonth(dt.getMonth() - 6);	//FROM n MONTHS AGO
// var dts = '"'+encodeURI(dt.toISOString())+'"';

//FIXME§:
// <p>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</p>
// <p><strong style="color:#FF0000">Error</strong>: line 1: parse error: Invalid parameter for print: "%" </p>
// <p><strong style="color:#FF0000">Error</strong>: line 1: parse error: Unknown type ";" </p>
// <p><strong style="color:#FF0000">Error</strong>: line 1: parse error: An empty query is not allowed </p>


L.layerJSON({
	url: overpassUrl+'node({lat1},{lon1},{lat2},{lon2});out meta;;',
	propertyItems: 'elements',
	propertyTitle: 'tags.name',
	propertyLoc: ['lat','lon'],
	// buildIcon: function(data, title) {
	// 	return new L.Icon({
	// 		iconUrl:'bar.png',
	// 		iconSize: new L.Point(32, 37),
	// 		iconAnchor: new L.Point(18, 37),
	// 		popupAnchor: new L.Point(0, -37)
	// 	});
	// },
	// buildPopup: function(data, marker) {
	// 	return data.tags.name || null;
	// }
})
.on('dataloading',function(e) {
	console.log('dataloading',e);
	//loader.style.display = 'block';
})
.on('dataloaded',function(e) {
	console.log('dataloaded',e);
	//loader.style.display = 'none';
})
.addTo(map);

//CONTROL SIDEBAR
//L.control.sidebar('sidebar',{position:'right', autoPan:false}).addTo(map).show();

});

