/*
<osm version="0.6" generator="OpenStreetMap server">
<user id="130691" display_name="StefanoCudini" account_created="2009-06-01T18:03:32Z">
<description>[labs.easyblog.it](http://labs.easyblog.it/)</description>
<contributor-terms agreed="true"/>
<img href="http://api.openstreetmap.org/attachments/users/images/000/130/691/original/39c24d8cd7d1cb787df7f31ffd98c2c9.jpg"/>
<roles></roles>
<changesets count="1804"/>
<traces count="125"/>
<blocks>
<received count="0" active="0"/>
</blocks>
</user>
</osm>	
*/
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

var sidebar$ = $('#sidebar'),
	userlist$ = $('#userlist');

window.users = users;

function avatarByUid(uid) {
	var avatar = '';
	
	sidebar$.addClass('loading');
	
	$.ajax({
		async: false,
		url: 'http://api.openstreetmap.org/api/0.6/user/'+uid,
		dataType: 'xml',
		success: function(xml) {
			avatar = $(xml).find('img').attr('href');
			sidebar$.removeClass('loading');
		}
	});
	return avatar;
}

L.layerJSON({
	//http://overpass-turbo.eu/s/3Ml
	//(node();way["highway"~"."]();>;);out meta;
	//way["highway"~"."]({lat1},{lon1},{lat2},{lon2});>;out meta;
	minZoom: 15,
	url: overpassUrl+'data=[out:json];way["highway"~"."]({lat1},{lon1},{lat2},{lon2});>;out meta;',
	propertyItems: 'elements',
	propertyTitle: 'tags.name',
	propertyLoc: ['lat','lon'],
	dataToMarker: function(data,ll) {
		//console.log(data);
		if(!users[data.uid])
		{
			users[data.uid] = {
				username: data.user,
				avatar: avatarByUid(data.uid),
				color: rgb2hex(randcolor()),
				locs: [ll]
			};
			userlist$.append('<div class="useritem" style="background:'+users[data.uid].color+'">'+
				'<img height="24" width="25" src="'+users[data.uid].avatar+'" /> '+
				'<a target="_blank" href="http://osm.org/user/'+users[data.uid].username+'">'+users[data.uid].username+'</a>'+
				'</div>');
		}
		else
			users[data.uid].locs.push(ll);

		return false;//L.circle(ll, 10);
	}
})
.on('dataloading',function(e) {
	console.log('dataloading');
	userlist$.empty();
})
.on('dataloaded',function(e) {
	for(var uid in users)
	{
		//TODO avatar http://leafletjs.com/reference.html#imageoverlay
		var rect = L.rectangle(L.latLngBounds(users[uid].locs), {color: users[uid].color }).addTo(map);
		//geoLayer.addData( rect.toGeoJSON() );
	}
	
})
.addTo(map);

//CONTROL SIDEBAR
L.control.sidebar('sidebar',{position:'right'}).addTo(map).show();

});

