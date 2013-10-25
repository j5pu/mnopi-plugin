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


var actualUrl;
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

function filterHTML(cadena) {
	var string = cadena.match(/%3Cstyle(.*?)%3C\/style%3E/gm);
	if (string != null)
	{	
		for(var i=0;i<string.length;i++)
			cadena = cadena.replace(string[i],'');
		string = cadena.match(/%3Cscript(.*?)%3C\/script%3E/gm);
		if (string != null)
			for(var i=0;i<string.length;i++)
				cadena = cadena.replace(string[i],'');
	}
	return cadena;
}

function getUrlVars(href) //para bing
{
    var vars = [], hash;
    var hashes = href.slice(href.indexOf('?') + 1).split('&'); //toma todo lo que hay entre ? y # y lo va troceando
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

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

function delquote(str){return (str=str.replace(/["']{1}/gi,""));} 

function sendRequest(url)
{
	twitterMain = false;
	var xhr = new XMLHttpRequest();
	//var urlRest="http://localhost:8080/RESTInterface/rest/json/novared/sendPageVisited";
	var urlRest = "http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendPageVisited"; 
	/*xhr.callback = function(){
		//alert(alerta);
	};*/
	xhr.onreadystatechange = readResponse;
	xhr.open("POST", urlRest, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	xhr.send("{\"urlPageVisited\":\""+url+"\",\"idUser\":\""+localStorage["email"]+"\"}");
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

function sendRequestHTML(url)
{
	twitterMain = false;
	var request = new XMLHttpRequest();
	request.callback = function(){
		var xhr = new XMLHttpRequest();
		//var urlRest="http://localhost:8080/RESTInterface/rest/json/novared/sendHTMLVisited";
		var urlRest = "http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendHTMLVisited"; 
		xhr.open("POST", urlRest, true);
		/*xhr.callback = function(){
			alert(decodeURI(alerta));
		};*/
		xhr.onreadystatechange = readResponse;
		xhr.setRequestHeader("Content-Type", "application/json");
		cadena = encodeURI(cadena);
		cadena = filterHTML(cadena);
		//console.log(decodeURI(cadena));
		//cadena = "blabla";//solo para pruebas
		xhr.send("{\"url\":\""+url+"\",\"htmlString\":\""+cadena+"\",\"idUser\":\""+localStorage["email"]+"\"}");
		
	};
	request.open("GET", url, true);
	request.send(null);
	request.onreadystatechange = readResponse2;
}

function readResponse2() {
  if (this.readyState == 4) {
      if(this.status == 0) {
        throw('Status = 0');
      }
	cadena = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
	this.callback();
}
}

function sendRequestSearch(url,q) { //valido para google, bing, yahoo, duckduckgo y yandex
	var q;
	twitterMain = false;
	if((url.indexOf("/search") > -1) || (url.indexOf("www.google.") > -1)  || (url.indexOf("duckduckgo.com/?q") > -1)
	 || (url.indexOf("www.yandex.com/yandsearch") > -1)){ //depurar un poco la parte de google
	 	if (url.indexOf("www.google.") > -1)
		{
			q = getQuestion("google", url);
		}
		else if (url.indexOf("duckduckgo.com/?q") > -1)
		{
			q = getQuestion("duck", url);
		}
		else if (url.indexOf("www.yandex.com/yandsearch") > -1)
		{
			q = getQuestion("yandex", url);
		}
		else if (url.indexOf("/search") > -1)
		{
			q = getQuestion("", url);
		}
		//var v = getUrlVars(url);
		var xhr = new XMLHttpRequest();
		//var urlRest="http://localhost:8080/RESTInterface/rest/json/novared/sendSearch";
		var urlRest="http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendSearch";
		/*xhr.callback = function(){
				alert(alerta);
		};*/
		xhr.onreadystatechange = readResponse;
		xhr.open("POST", urlRest, true);
		xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		xhr.send("{\"searchResults\":\""+url+"\",\"searchDone\":\""+q+"\",\"idUser\":\""+localStorage["email"]+"\"}");
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
					var urlRest="http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendComments";
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
				var urlRest="http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendComments";
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

function checkForValidUrl(tabId, changeInfo, tab) {
if (changeInfo.status == "complete") {
	console.log(changeInfo.url);
		//alert(tab.url); //
		var a = sessionStorage['url'];
		actualUrl = tab.url;
		if ((tab.url == a) && (!twitterMain))
		{
			//alert("recargaste bribon!"); //Recarga de página
		}
		else 
		{
			if ((tab.url.indexOf("chrome://") == -1) && (tab.url.indexOf("chrome-devtools://") == -1))
			{
		 		sessionStorage['url'] = tab.url;
		 		if (localStorage["visited"] == "true")
		 			try {
		 				sendRequest(tab.url);
		 			} catch (e1) {
		 				console.log("Error en método SendPageVisited: " + e1);
		 			} finally {
				 		if (localStorage["html"] == "true")
				 			try {
								sendRequestHTML(tab.url);
							} catch (e2) {
				 				console.log("Error en método SendHTMLVisited: " + e2);
				 		} finally {
							if (localStorage["search"] == "true")
								try {
									sendRequestSearch(tab.url);
								} catch (e3) {
					 				console.log("Error en método SendSearch: " + e3);
					 		} finally {
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
				
		}
	}
}

/*var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': <OAuth request URL>,
  'authorize_url': <OAuth authorize URL>,
  'access_url': <OAuth access token URL>,
  'consumer_key': <OAuth consumer key>,
  'consumer_secret': <OAuth consumer secret>,
  'scope': <scope of data access, not used by all OAuth providers>,
  'app_name': <application name, not used by all OAuth providers>
});*/

function listener(tabId, changeInfo, tab){
	checkForValidUrl(tabId, changeInfo, tab); 
};

function updateClicks() {
	if (current == 2)
	{
		alert("Goodbye!");
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {greeting: "off"}, function(response) {
		  	});
		});
		chrome.browserAction.setBadgeText({text:""});
		chrome.tabs.onUpdated.removeListener(listener);
		current++;
	  	if (current > max)
	    	current = min;
	    	return;
	}
	else
	{
		chrome.browserAction.setBadgeText({text:"X"});
		alert("Welcome to mnopi");
		chrome.tabs.onUpdated.addListener(listener);
	}
  	current++;

  	if (current > max)
    	current = min;
    	
}

chrome.browserAction.setBadgeText({text:""});




chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "tweet")
    {
    	var xhr = new XMLHttpRequest();
		var urlRest="http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendComments";
		xhr.open("POST", urlRest, true);
		xhr.onreadystatechange = readResponse;
		xhr.setRequestHeader("Content-Type", "application/json");
		if ((localStorage[request.variable] != "stored") && (!nuloT))
		{	
			xhr.send("{\"idUser\":\""+localStorage["email"]+"\",\"url\":\"https://twitter.com\",\"commentsDone\":\""+request.variable+"\"}");
			setTimeout(function() {},500);
			localStorage[request.variable] = "stored";
		}
    } else if (request.greeting == "comment") 

    {
    	var xhr = new XMLHttpRequest();
		var urlRest="http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendComments";
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