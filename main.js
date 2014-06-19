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

var minZoom = 14,
	map = new L.Map('map', {
		attributionControl: false,
		//layers: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
		layers: L.tileLayer('http://a.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'),
		minZoom: minZoom
	}),
	//overpassUrl= 'http://overpass.osm.rambler.ru/cgi/interpreter?'
	overpassUrl= 'http://overpass-api.de/api/interpreter?';

L.control.attribution({
	position: 'bottomleft',
	prefix: 'made with <a href="http://leafletjs.com/">Leaflet</a> &bull; map data &copy; <a href="http://osm.org/" target="_blank">OpenStreetMap contributors</a>',
}).addTo(map);

map.setView(L.latLng(42.4461,12.4937), minZoom);

var geoLayer = L.layerGroup([]).addTo(map);

var users = {};

var sidebar$ = $('#sidebar'),
	userlist$ = $('#userlist');

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

//https://gist.github.com/bmcbride/4248238
function toWKT(layer) {
    var lng, lat, coords = [];
    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
        var latlngs = layer.getLatLngs();
        for (var i = 0; i < latlngs.length; i++) {
	    	//latlngs[i]
	    	coords.push(latlngs[i].lng + " " + latlngs[i].lat);
	        if (i === 0) {
	        	lng = latlngs[i].lng;
	        	lat = latlngs[i].lat;
	        }
	}
        if (layer instanceof L.Polygon) {
            return "POLYGON((" + coords.join(",") + "," + lng + " " + lat + "))";
        } else if (layer instanceof L.Polyline) {
            return "LINESTRING(" + coords.join(",") + ")";
        }
    } else if (layer instanceof L.Marker) {
        return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
    }
}

function geomIntersect(recta, rectb, color) {
	var WKTReader = new jsts.io.WKTReader(),
		geoWriter = new jsts.io.GeoJSONWriter(),
		wa = toWKT(recta),
		wb = toWKT(rectb);

	var inter = WKTReader.read(wa).intersection( WKTReader.read(wb) );
	
	inter = geoWriter.write(inter);
	inter = L.GeoJSON.geometryToLayer(inter);
	
	inter.setStyle({color: color,
		opacity:1,
		fill: false,
		fillOpacity:0.2
	});

	return inter;
}

L.layerJSON({
	//http://overpass-turbo.eu/s/3Ml
	//(node();way["highway"~"."]();>;);out meta;
	//way["highway"~"."]({lat1},{lon1},{lat2},{lon2});>;out meta;
	//minZoom: 15,
	caching: false,
	//url: overpassUrl+'data=[out:json];way["highway"~"."]({lat1},{lon1},{lat2},{lon2});>;out meta;',
	url: overpassUrl+'data=[out:json];node({lat1},{lon1},{lat2},{lon2});out meta;',
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
	geoLayer.clearLayers();
	var mapRect = L.rectangle( map.getBounds().pad(-0.98) );
	for(var uid in users)
	{
		var rect = L.rectangle(L.latLngBounds(users[uid].locs));
		
		rect = geomIntersect(mapRect, rect, users[uid].color);
		
		geoLayer.addLayer(rect);
		
		userlist$.append('<div class="useritem" style="background:'+users[uid].color+'">'+
			'<img height="24" width="25" src="'+users[uid].avatar+'" /> '+
			'<a target="_blank" href="http://osm.org/user/'+users[uid].username+'">'+users[uid].username+'</a>'+
			'</div>');
		//TODO send message: 'http://osm.org/message/new/'+users[uid].username
	}
})
.addTo(map);

//CONTROL SIDEBAR
L.control.sidebar('sidebar',{position:'right'}).addTo(map).show();

// var locationFilter = new L.LocationFilter({
// 	bounds: map.getBounds().pad(-0.90)
// })
// .addTo(map);

// locationFilter.on("change", function (e) {
// 	console.log(e.bounds);
//     // Do something when the bounds change.
//     // Bounds are available in `e.bounds`.
// });

// locationFilter.on("enabled", function () {
//     // Do something when enabled.
// });

// locationFilter.on("disabled", function () {
//     // Do something when disabled.
// });

});

