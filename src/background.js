// Status codes as per rfc2616
var statusCodes = new Array();
// Informational 1xx
statusCodes[100] = 'Continue';
statusCodes[101] = 'Switching Protocols';
// Successful 2xx
statusCodes[200] = 'OK';
statusCodes[201] = 'Created';
statusCodes[202] = 'Accepted';
statusCodes[203] = 'Non-Authoritative Information';
statusCodes[204] = 'No Content';
statusCodes[205] = 'Reset Content';
statusCodes[206] = 'Partial Content';
// Redirection 3xx
statusCodes[300] = 'Multiple Choices';
statusCodes[301] = 'Moved Permanently';
statusCodes[302] = 'Found';
statusCodes[303] = 'See Other';
statusCodes[304] = 'Not Modified';
statusCodes[305] = 'Use Proxy';
statusCodes[307] = 'Temporary Redirect';
// Client Error 4xx
statusCodes[400] = 'Bad Request';
statusCodes[401] = 'Unauthorized';
statusCodes[402] = 'Payment Required';
statusCodes[403] = 'Forbidden';
statusCodes[404] = 'Not Found';
statusCodes[405] = 'Method Not Allowed';
statusCodes[406] = 'Not Acceptable';
statusCodes[407] = 'Proxy Authentication Required';
statusCodes[408] = 'Request Time-out';
statusCodes[409] = 'Conflict';
statusCodes[410] = 'Gone';
statusCodes[411] = 'Length Required';
statusCodes[412] = 'Precondition Failed';
statusCodes[413] = 'Request Entity Too Large';
statusCodes[414] = 'Request-URI Too Long';
statusCodes[415] = 'Unsupported Media Type';
statusCodes[416] = 'Requested range not satisfiable';
statusCodes[417] = 'Expectation Failed';
// Server Error 5xx
statusCodes[500] = 'Internal Server Error';
statusCodes[501] = 'Not Implemented';
statusCodes[502] = 'Bad Gateway';
statusCodes[503] = 'Service Unavailable';
statusCodes[504] = 'Gateway Time-out';
statusCodes[505] = 'HTTP Version not supported';


var currentUrl;
var twitterMain = false;
var cadena;
var alerta;
var userName;
var tweets;
var tweetArray = [];
var numTweets = 4;
var comments;
var commentArray = [];
var numComments = 3; //solo es posible tomar los 3 ultimos
var indexT = 0;
var indexF = 0;
var nuloT = false;
var nuloF = false;

var min = 1;
var max = 2;
var current = min;

sessionStorage["url"] = "";

function getQuestion(service, url)
{
	var keyword;
	var v, q;

	switch(service)
	{
		case "google":
			if (url.indexOf("#") > -1){
				keyword = url.match(/#q=(.*)/);
				return keyword[1];
			}
			else {
				v = getUrlVars(url);
				if (v != url)
					q = v.q;
				return q;
			}
		case "duck":
			keyword = url.match(/\?q=(.*)/);
			return keyword[1];
		case "yandex":
			v = getUrlVars(url);
			if (v != url)
				q = v.text;
			return q;
		default: //bing y yahoo
			v = getUrlVars(url);
			if (v != url)
				if (url.indexOf("yahoo") > -1)
					q = v.p;
				else
					q = v.q;
			return q;

	}
}

function sendPageVisited(url)
{
	twitterMain = false;
	var xhr = new XMLHttpRequest();
	var urlRest = MNOPI_SERVER_URL + POST_SERVICES['sendPageVisited'];
	xhr.onreadystatechange = readResponse;
	xhr.open("POST", urlRest, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

    var pageVisited = new Object();
    pageVisited.url = url;
    pageVisited.idUser = localStorage["email"];
    var postData = JSON.stringify(pageVisited);

    xhr.send(postData);
}

function readResponse() {
	if (this.readyState == 4) {
		if(this.status == 0) {
			throw('Status = 0');
		}
  		alerta = this.status+' '+statusCodes[this.status]+'</br>'+this.responseText;
  		//this.callback();
	}
}

function sendHtmlVisited(url)
{
	twitterMain = false;
	var request = new XMLHttpRequest();
	request.callback = function(){
		var xhr = new XMLHttpRequest();
		var urlRest = MNOPI_SERVER_URL + POST_SERVICES['sendHtmlVisited'];
		xhr.open("POST", urlRest, true);
		xhr.callback = function(){
			alert(decodeURI(alerta));
		};
		xhr.onreadystatechange = readResponse;
		xhr.setRequestHeader("Content-Type", "application/json");

        htmlCode = filterHTML(htmlCode, "script");
        htmlCode = filterHTML(htmlCode, "style");

        var htmlVisited = new Object();
        htmlVisited.url = url;
        htmlVisited.htmlString = htmlCode;
        htmlVisited.idUser = localStorage["email"];
        var postData = JSON.stringify(htmlVisited);
        xhr.send(postData);
	};
	request.open("GET", url, true); //TODO: quiza este get pueda apañarse
	request.send(null);
	request.onreadystatechange = readResponse2;
}

function readResponse2() {
  if (this.readyState == 4) {
      if(this.status == 0) {
        throw('Status = 0');
      }
	htmlCode = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
	this.callback();
}
}

function sendSearchedString(url,q) { //valido para google, bing, yahoo, duckduckgo y yandex
	var query;
	twitterMain = false;
	if((url.indexOf("/search") > -1) || (url.indexOf("www.google.") > -1)  || (url.indexOf("duckduckgo.com/?q") > -1)
	 || (url.indexOf("www.yandex.com/yandsearch") > -1)){ //depurar un poco la parte de google
	 	if (url.indexOf("www.google.") > -1)
		{
			query = getQuestion("google", url).replace(/\+/g, " ")
		}
		else if (url.indexOf("duckduckgo.com/?q") > -1)
		{
			query = getQuestion("duck", url);
		}
		else if (url.indexOf("www.yandex.com/yandsearch") > -1)
		{
			query = getQuestion("yandex", url);
		}
		else if (url.indexOf("/search") > -1)
		{
			query = getQuestion("", url);
		}
		//var v = getUrlVars(url);
		var xhr = new XMLHttpRequest();
		var urlRest=MNOPI_SERVER_URL + POST_SERVICES['sendSearch'];
		xhr.onreadystatechange = readResponse;
		xhr.open("POST", urlRest, true);
		xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        var searchData = new Object();
        searchData.searchResults = url;
        searchData.searchDone = query;
        searchData.idUser = localStorage["email"];
        var postData = JSON.stringify(searchData);

		xhr.send(postData);
    }
}

function sendRequestComments(url) {
	if (url == "https://twitter.com/"){
		var xhrh = new XMLHttpRequest();
		var urlRestH0="https://twitter.com/settings/account"; //pasar aqui todas las url
	
		var request = new XMLHttpRequest();
		request.callback = function(){
			if (userName != undefined)
			{
				var xhrt = new XMLHttpRequest();
				//var urlRestTw="https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name="+userName+"&count="+numTweets+"";
				var urlRestTw="https://twitter.com/"+userName;
				twitterMain = false;
				xhrt.open("GET", urlRestTw, true);
				xhrt.send(null);
				xhrt.onreadystatechange = readResponse5;
				xhrt.callback = function(){
					indexT++;
					var xhr = new XMLHttpRequest();
					//var urlRest="http://localhost:8080/RESTInterface/rest/json/novared/sendComments";
					var urlRest="disabled"//"http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendComments";
					xhr.open("POST", urlRest, true);
					/*xhr.callback = function(){
						alert(alerta);
					};*/
					xhr.onreadystatechange = readResponse;
					xhr.setRequestHeader("Content-Type", "application/json");
					if ((localStorage[tweetArray[indexT-1]] == "true") && (!nuloT))
					{	
						xhr.send("{\"idUser\":\""+localStorage["email"]+"\",\"url\":\""+urlRestH0.match("(.*)com/")[0]+"\",\"commentsDone\":\""+tweetArray[indexT-1]+"\"}");
						setTimeout(function() {},500);
						localStorage[tweetArray[indexT-1]] = "stored";
					}
				};
			}
			else
			{
				//alert("usuario indefinido"); //Pagina principal de twitter
				twitterMain = true;
			}
		};
		
		request.open("GET", urlRestH0, true);
		request.send(null);
		request.onreadystatechange = readResponse3;
		
		
	}
	else if ((url == "https://www.facebook.com/?sk=welcome") || (url == "https://www.facebook.com/")){
		twitterMain = false;
		var xhrh = new XMLHttpRequest();
		var urlRestH0="https://www.facebook.com/settings"; //pasar aqui todas las url
	
		var request = new XMLHttpRequest();
		request.callback = function(){
			var xhrt = new XMLHttpRequest();
	
			//var urlRestTw="https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name="+userName+"&count="+numTweets+"";
			var urlRestTw="https://www.facebook.com/"+userName;
			
			xhrt.open("GET", urlRestTw, true);
			xhrt.onreadystatechange = readResponse5b;
			xhrt.send(null);
			xhrt.callback = function(){
				indexF++;
				var xhr = new XMLHttpRequest();
				//var urlRest="http://localhost:8080/RESTInterface/rest/json/novared/sendComments";
				var urlRest="disabled";//http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendComments";
				xhr.open("POST", urlRest, true);
				/*xhr.callback = function(){
					alert(alerta);
				};*/
				xhr.onreadystatechange = readResponse;
				xhr.setRequestHeader("Content-Type", "application/json");
				if (localStorage[commentArray[indexF-1]] == "true")
				{	
					xhr.send("{\"idUser\":\""+localStorage["email"]+"\",\"url\":\""+urlRestH0.match("(.*)com/")[0]+"\",\"commentsDone\":\""+commentArray[indexF-1]+"\"}");
					setTimeout(function() {},500);
					localStorage[commentArray[indexF-1]] = "stored";
				}
			};
		};
		request.open("GET", urlRestH0, true);
		request.send(null);
		request.onreadystatechange = readResponse3b;
	}
}

function readResponse3() {
	if (this.readyState == 4) {
      if(this.status == 0) {
        throw('Status = 0');
      }	
		cadena = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
		var testRE = cadena.match(/<span id="username_path">(.*)/);
		if (testRE == null)
			nuloT = true;
		else
		{
			var testRE2 = testRE[1].match(/<\/span>(.*)/);

			userName = testRE[1];
			var cadenAux = testRE2[0];
			userName = userName.replace(cadenAux,'');
			userName = userName.toLowerCase();
		}
		this.callback();
	}
}

function readResponse3b() {
	if (this.readyState == 4) {
      if(this.status == 0) {
        throw('Status = 0');
      }
		cadena = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
		var testRE = cadena.match(/http:\/\/www.facebook.com\/<strong>(.*)/);
		/*if (testRE == null)
			nuloF = true;
		else
		{*/
			var testRE2 = testRE[1].match(/<\/strong>(.*)/);
			userName = testRE[1];
			var cadenAux = testRE2[0];
			userName = userName.replace(cadenAux,'');
			userName = userName.toLowerCase();
		//}
		this.callback();
	}
}

function readResponse5(){
	if (this.readyState == 4) {
      if(this.status == 0) {
        throw('Status = 0');
    	}	
    	tweets = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
		tweets = delquote(tweets);
		for (var i=0;i<numTweets;i++){
			var tweet = tweets.match("<p class=js-tweet-text tweet-text>(.*)</p>")[1];
			tweets = tweets.substring(tweets.indexOf("<p class=js-tweet-text tweet-text>") + 1);
			//console.log(tweet);
			tweetArray.push(tweet);
			if (localStorage[tweet] != "stored")
				localStorage[tweet] = true;
			this.callback();
		}
	}
}

function readResponse5b(){
	if (this.readyState == 4) {
    	if(this.status == 0) {
        	throw('Status = 0');
    	}
    	comments = this.responseText;
		comments = delquote(comments);
		for (var i=0;i<numComments;i++){
			var commenta = comments.match(/class=userContent>(.*)/);
			if (commenta == null)
				break;
			var comment = commenta[1];
			var testRE2 = comment.match(/<\/span>(.*)/);
			var cadenAux = testRE2[0];
			comment = comment.replace(cadenAux,'');
			//console.log(comment);
			comments = comments.substring(comments.indexOf(comment)+1);
			commentArray.push(comment);
			if (localStorage[comment] != "stored")
				localStorage[comment] = true;
			this.callback();
		}
	}
}

function isValidUrl(url) {
    return (url.indexOf("chrome://") == -1 &&
        url.indexOf("chrome-devtools://") == -1 &&
        url.indexOf("localhost:") == -1 &&
        url.indexOf("127.0.0.1") == -1 &&
        url.slice(-4) != ".pdf")
}

function sendInformation(tabId, changeInfo, tab) {

    if (changeInfo.status == "complete") {

		var previousUrl = sessionStorage['url'];
		currentUrl = tab.url;

        // Upon refreshing no info is sent
        // TODO: Review twitterMain behaviour
		if ((tab.url != previousUrl) || (twitterMain))
        {
			if (isValidUrl(tab.url))
			{
		 		sessionStorage['url'] = tab.url;
		 		if (localStorage["visited"] == "true")
                {
		 			try {
		 				sendPageVisited(tab.url);
		 			} catch (e1) {
		 				console.log("Error en método SendPageVisited: " + e1);
                    }
                }
                if (localStorage["html"] == "true")
                {
                    try {
                        sendHtmlVisited(tab.url);
                    } catch (e2) {
                        console.log("Error en método SendHTMLVisited: " + e2);
                    }
                }
                if (localStorage["search"] == "true")
                {
                    try {
                        sendSearchedString(decodeURIComponent(tab.url));
                    } catch (e3) {
                        console.log("Error en método SendSearch: " + e3);
                    }
                }
                if (localStorage["comments"] == "true")
                {
                    try {
                        if (tab.url.indexOf("https://www.facebook.com/") > -1)
                            chrome.tabs.executeScript(null, {file: "observer.js"});
                        else if (tab.url.indexOf("https://twitter.com/") > -1)
                            chrome.tabs.executeScript(null, {file: "observerT.js"});
                        sendRequestComments(tab.url);
                    } catch (e4) {
                        console.log("Error en método SendComments: " + e4);
                    }
                }
			}
		}
	}
}

function updateClicks() {
	if (current == 2)
	{
		alert("Mnopi desactivado. Ya no se guardan los datos");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {greeting: "off"}, function(response) {
		  	});
		});
		chrome.browserAction.setBadgeText({text:""});
		chrome.tabs.onUpdated.removeListener(sendInformation);
		current++;
	  	if (current > max)
	    	current = min;
	    	return;
	}
	else
	{
		chrome.browserAction.setBadgeText({text:"X"});
//		alert("Monitorizando");
		chrome.tabs.onUpdated.addListener(sendInformation);
	}
  	current++;

  	if (current > max)
    	current = min;
    	
}

chrome.browserAction.setBadgeText({text:""});

/* Auto login if the user selected to be remembered */
//TODO: se esta guardando la pass en claro...nefasto.
//TODO: este sistema de guardar el login es muy cutre, habría que cambiar el login entero del plugin
if (localStorage['remembered'] && localStorage["email"]){
    updateClicks()
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "tweet")
    {
    	var xhr = new XMLHttpRequest();
		var urlRest="disabled"//http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendComments";
		xhr.open("POST", urlRest, true);
		xhr.onreadystatechange = readResponse;
		xhr.setRequestHeader("Content-Type", "application/json");
		if ((localStorage[request.variable] != "stored") && (!nuloT))
		{	
			xhr.send("{\"idUser\":\""+localStorage["email"]+"\",\"url\":\"https://twitter.com\",\"commentsDone\":\""+request.variable+"\"}");
			setTimeout(function() {},500);
			localStorage[request.variable] = "stored";
		}
    }
    else if (request.greeting == "comment")
    {
    	var xhr = new XMLHttpRequest();
		var urlRest="disabled"//http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendComments";
		xhr.open("POST", urlRest, true);
		xhr.onreadystatechange = readResponse;
		xhr.setRequestHeader("Content-Type", "application/json");
		if ((localStorage[request.variable] != "stored") && (!nuloT))
		{	
			xhr.send("{\"idUser\":\""+localStorage["email"]+"\",\"url\":\"https://www.facebook.com/\",\"commentsDone\":\""+request.variable+"\"}");
			setTimeout(function() {},500);
			localStorage[request.variable] = "stored";
		}    

    }

  });