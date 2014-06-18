
function minmaxrandom(min, max)	//genera numero casuale compreso in un range di valori
{
	return Math.random() * (max - min) + min;
}

//GESTIONE COLORI!!

function rgb2hex(rgb) 	//converte da array di valori 0-255 e stringa esadecimale
{
	function toHex(n) {
		n = parseInt(n,10);
		if (isNaN(n)) return "00";
		n = Math.max(0,Math.min(n,255));
		return "0123456789ABCDEF".charAt((n-n%16)/16)
		  + "0123456789ABCDEF".charAt(n%16);
	}
	return '#'+toHex(rgb[0])+toHex(rgb[1])+toHex(rgb[2]);
}

function hex2rgb(hex)
{		
  var c, o = [], k = 0, m = hex.match(/^#(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})|([0-9a-f])([0-9a-f])([0-9a-f]))$/i);
      
  if (!m) return {r:0,g:0,b:0};
  for (var i = 2, s = m.length; i < s; i++) {
    if (undefined === m[i]) continue;
    c = parseInt(m[i], 16);
    o[k++] = c + (i > 4 ? c * 16 : 0);
  }
  return o;
}

function randcolor()		//restituisce un array con valori RGB 0-255
{
	function c() {
		return Math.floor(minmaxrandom(120,250));//30 e 240  senno' vengono troppo scuri/chiari
	}

	return [c(), c(), c()];
}

function randcolorhue(rgb) {	//genera colore casuale con stessa tonalita' del colore rgb
	var hsl = rgb2hsl(rgb);
	var newhsl = [hsl[0], hsl[1]*0.9, Math.min(hsl[2]*minmaxrandom(0.8,1.1),1)];
	//stessa tonalita'
	return hsl2rgb(newhsl);
}


/**
http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 */
function rgb2hsl(rgb) {
	var r,g,b;
	r=rgb[0];g=rgb[1];b=rgb[2];
	
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 */
function hsl2rgb(hsl) {
	var h,s,l;
	h=hsl[0];s=hsl[1];l=hsl[2];

    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.ceil(r * 255), Math.ceil(g * 255), Math.ceil(b * 255)];
}
