$(function() {

var map = new L.Map('map',{attributionControl: false}).setView(L.latLng(36,-30),3);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.control.attribution({
	prefix: '<a href="http://leafletjs.com/">Leaflet</a> &bull; <a href="http://osm.org/" target="_blank">OpenStreetMap contributors</a>',
}).addTo(map);

//CONTROL SIDEBAR
//L.control.sidebar('sidebar',{position:'right', autoPan:false}).addTo(map).show();

});

