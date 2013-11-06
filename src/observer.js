//Para facebook

var oldTitle = document.title;
window.setInterval(function()
{
    if (document.title !== oldTitle)
    {
        var observer = new WebKitMutationObserver(function(mutations) {    
        	mutations.forEach(function(mutation) {
            	var clase = mutation.target.innerHTML;
                if (clase.indexOf("class=\"userContent\">") > -1){
                	clase = delquote(clase);
                	var commenta = clase.match(/class=userContent>(.*)/);
        			var comment = commenta[1];
        			var testRE2 = comment.match(/<\/span>(.*)/);
        			var cadenAux = testRE2[0];
        			comment = comment.replace(cadenAux,"");
                    chrome.runtime.sendMessage({greeting: "comment", variable: comment}, function(response) {
                	//Paso de mensajes
                    });
                }
            });    
        });

        observer.observe(document.getElementsByClassName("_3rbf clearfix")[0], { subtree: true, attributes: true, childList: true, characterData: true });
        //observer.disconnect(); - to stop observing
        clearInterval();
    }
    oldTitle = document.title;
}, 100);
        

function delquote(str){return (str=str.replace(/["']{1}/gi,""));}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "off")
      observer.disconnect();
      return true;
  });