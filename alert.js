/*var observer = new WebKitMutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
    	var clase = mutation.target.innerHTML;     
        if (clase.indexOf("class=\"userContent\">") > -1){
        	clase = delquote(clase);
        	var commenta = clase.match(/class=userContent>(.*)/);
			var comment = commenta[1];
			var testRE2 = comment.match(/<\/span>(.*)/);
			var cadenAux = testRE2[0];
			comment = comment.replace(cadenAux,'');
        	console.log(comment);
        } //clase.textContent//Poner salida por consola para no estallar con subtree
    });    
});

observer.observe(document.getElementsByClassName("_3rbf clearfix")[0], { subtree: true, attributes: true, childList: true, characterData: true });
//observer.disconnect(); - to stop observing

function delquote(str){return (str=str.replace(/["']{1}/gi,""));} */

alert("alerta");
