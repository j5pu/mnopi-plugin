//Para twitter



var observer = new WebKitMutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
    	var clase = mutation.target.innerHTML;     
        if (clase.indexOf("<p class=\"js-tweet-text tweet-text\">") > -1){
        	clase = delquote(clase);
			var tweet = clase.match("<p class=js-tweet-text tweet-text>(.*)</p>")[1];
        	chrome.runtime.sendMessage({greeting: "tweet", variable: tweet}, function(response) {
  				//console.log(response.farewell);
			});
        	//Paso de mensajes
        }
    });    
});

observer.observe(document.getElementById("timeline"), { subtree: true, attributes: true, childList: true, characterData: true });
//observer.disconnect(); - to stop observing

function delquote(str){return (str=str.replace(/["']{1}/gi,""));}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "off")
      observer.disconnect();
      return true;
  });