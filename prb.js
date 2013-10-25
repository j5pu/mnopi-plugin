var cadena = "<html></html>";
cadena = encodeURI(cadena);
//cadena = filterHTML(cadena);
alert(cadena);
function filterHTML(cadena) {
	var string = cadena.match(/%3Cscript(.*?)%3C\/script%3E/gm);
	for(var i=0;i<string.length;i++)
		cadena = cadena.replace(string[i],'');
	return cadena;
}
//var s = function(a,b){for(b=/<script[^>]*>.*?<\/script>/gi;b.test(a);)a=a.replace(b,'');return a}
