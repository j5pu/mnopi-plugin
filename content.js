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

var urlArray = [];
var titleArray = [];
var cadena;
var alerta;
var userName;
var tweets;
var tweetArray = [];
var numTweets = 4;
var comments;
var commentArray = [];
var numComments = 3; //solo es posible tomar los 3 ultimos
var maxResults = 3;
var index = 0;
var reload = false;


alert("here we are!");

function filterHTML(cadena) {
	var string = cadena.match(/%3Cstyle(.*?)%3C\/style%3E/gm);
	for(var i=0;i<string.length;i++)
		cadena = cadena.replace(string[i],'');
	string = cadena.match(/%3Cscript(.*?)%3C\/script%3E/gm);
	for(var i=0;i<string.length;i++)
		cadena = cadena.replace(string[i],'');
	return cadena;
}

function getUrlVars(href)
{
    var vars = [], hash;
    var hashes = href.slice(href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function delquote(str){return (str=str.replace(/["']{1}/gi,""));} 

function sendRequest(url) {
	var xhr = new XMLHttpRequest();
	var urlRest="http://localhost:8080/RESTInterface/rest/json/novared/sendPageVisited";
	//var urlRest = "http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendPageVisited"; 
	xhr.callback = function(){
		//alert(alerta);
	};
	xhr.onreadystatechange = readResponse;
	xhr.open("POST", urlRest, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	xhr.send("{\"urlPageVisited\":\""+url+"\",\"idUser\":\"user@mnopi.com\"}");
	
	
}

function readResponse() {
	if (this.readyState == 4) {
		if(this.status == 0) {
			throw('Status = 0');
		}
  		alerta = this.status+' '+statusCodes[this.status]+'</br>'+this.responseText;
  		this.callback();
	}
}

function sendRequestHTML(url) {
	var request = new XMLHttpRequest();
	request.callback = function(){
		var xhr = new XMLHttpRequest();
		var urlRest="http://localhost:8080/RESTInterface/rest/json/novared/sendHTMLVisited";
		//var urlRest = "http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendHTMLVisited"; 
		xhr.open("POST", urlRest, true);
		xhr.callback = function(){
			alert(alerta);
		};
		xhr.onreadystatechange = readResponse;
		xhr.setRequestHeader("Content-Type", "application/json");
		cadena = encodeURI(cadena);
		cadena = filterHTML(cadena);
		//console.log(decodeURI(cadena));
		cadena = "blabla";//solo para pruebas
		xhr.send("{\"url\":\""+url+"\",\"htmlString\":\""+cadena+"\",\"idUser\":\"user@mnopi.com\"}");
		
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

function sendRequestSearch(url,q) {
	
	if((url.indexOf("/search") > -1) || (url.indexOf("www.google.") > -1)){ //depurar un poco la parte de google
		var v = getUrlVars(url);
		if (v != url){
			var q = v.q;
			var xhr = new XMLHttpRequest();
			var urlRest="http://localhost:8080/RESTInterface/rest/json/novared/sendSearch";
			//var urlRest="http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendSearch";
			xhr.callback = function(){
					alert(alerta);
				};
			xhr.onreadystatechange = readResponse;
			xhr.open("POST", urlRest, true);
			xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			xhr.send("{\"searchResults\":\""+url+"\",\"searchDone\":\""+q+"\"}");
		}
	}
}

function sendRequestComments(url) {
	if (url == "https://twitter.com/"){
		var xhrh = new XMLHttpRequest();
		var urlRestH0="https://twitter.com/settings/account"; //pasar aqui todas las url
	
		var request = new XMLHttpRequest();
		request.callback = function(){
			var xhrt = new XMLHttpRequest();
	
			//var urlRestTw="https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name="+userName+"&count="+numTweets+"";
			var urlRestTw="https://twitter.com/"+userName;
			
			xhrt.open("GET", urlRestTw, true);
			xhrt.onreadystatechange = readResponse5;
			xhrt.send(null);
			xhrt.callback = function(){
				index++;
				var xhr = new XMLHttpRequest();
				var urlRest="http://localhost:8080/RESTInterface/rest/json/novared/sendComments";
				//var urlRest="http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendComments";
				xhr.open("POST", urlRest, true);
				xhr.callback = function(){
					//alert(alerta);
				};
				xhr.onreadystatechange = readResponse;
				xhr.setRequestHeader("Content-Type", "application/json");
				//xhr.send("{\"idUser\":\""+name+"\",\"url\":"+name+"\"}"); //cambiar url y añadir commentsDone
				xhr.send("{\"idUser\":\""+userName+"\",\"url\":\""+urlRestH0.match("(.*)com/")[0]+"\",\"commentsDone\":\""+tweetArray[index]+"\"}"); //cambiar url y añadir commentsDone
				//tweetArray = tweetArray.pop();
			};
			//xhr.send("{\"htmlString\":\""+escape(cadena)+"\"}"); 
		};
		request.open("GET", urlRestH0, true);
		request.send(null);
		request.onreadystatechange = readResponse3;
	}
	else if (url == "https://www.facebook.com/"){
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
				index++;
				var xhr = new XMLHttpRequest();
				var urlRest="http://localhost:8080/RESTInterface/rest/json/novared/sendComments";
				//var urlRest="http://193.144.229.245:9760/RESTInterface/rest/json/novared/sendComments";
				xhr.open("POST", urlRest, true);
				xhr.callback = function(){
					alert(alerta);
				};
				xhr.onreadystatechange = readResponse;
				xhr.setRequestHeader("Content-Type", "application/json");
				//xhr.send("{\"idUser\":\""+name+"\",\"url\":"+name+"\"}"); //cambiar url y añadir commentsDone
				xhr.send("{\"idUser\":\""+userName+"\",\"url\":\""+urlRestH0.match("(.*)com/")[0]+"\",\"commentsDone\":\""+commentArray[index]+"\"}"); //cambiar url y añadir commentsDone
				//tweetArray = tweetArray.pop();
			};
			//xhr.send("{\"htmlString\":\""+escape(cadena)+"\"}"); 
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
		/*cadena = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
		var testRE = cadena.match("<span id=\"username_path\">(.*)</span>");
		userName = testRE[1];
		userName = userName.toLowerCase();
		//userName = userName.replace(/ /g,"");
		//alert(userName);
		this.callback();*/
		
		cadena = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
		var testRE = cadena.match(/<span id="username_path">(.*)/);
		var testRE2 = testRE[1].match(/<\/span>(.*)/);
		userName = testRE[1];
		var cadenAux = testRE2[0];
		userName = userName.replace(cadenAux,'');
		userName = userName.toLowerCase();
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
		var testRE2 = testRE[1].match(/<\/strong>(.*)/);
		userName = testRE[1];
		var cadenAux = testRE2[0];
		userName = userName.replace(cadenAux,'');
		//userName = testRE[1];
		userName = userName.toLowerCase();
		//userName = userName.replace(/ /g,"");
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
			console.log(tweet);
			tweetArray.push(tweet);
		}
		this.callback();
		
	}
}

function readResponse5b(){
	if (this.readyState == 4) {
      if(this.status == 0) {
        throw('Status = 0');
    }
    	comments = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
		comments = delquote(comments);
		for (var i=0;i<numComments;i++){
			var commenta = comments.match(/class=userContent>(.*)/);
			if (commenta == null)
				break;
			var comment = commenta[1];
			var testRE2 = comment.match(/<\/span>(.*)/);
			var cadenAux = testRE2[0];
			comment = comment.replace(cadenAux,'');
			console.log(comment);
			comments = comments.substring(comments.indexOf(comment)+1);
			//comments = comments.substring(comments.indexOf("<span class=userContent>") + 1);
			//console.log(comments);
			commentArray.push(comment);
		}
		this.callback();
	}
}

function checkForValidUrl(tabId, changeInfo, tab) {
	if (changeInfo.status == "complete") {
		var a = sessionStorage['url'];
		if (tab.url == a)
		{
			a = "asdf";
			reload = true;
			alert("recargaste bribon!");
		}
		else 
		{
			reload = false;
			if (tab.url.indexOf("chrome://") == -1)
			{
				chrome.pageAction.show(tabId);
		 		sessionStorage['url'] = tab.url;
		 		/*sendRequest(tab.url);
				sendRequestHTML(tab.url);
				sendRequestSearch(tab.url);*/
				sendRequestComments(tab.url);
			}
				
		}
	}
	/*if ((changeInfo.status == "complete") && (tab.url.indexOf("chrome://") == -1)){
		chrome.pageAction.show(tabId); //Es lo que muestra el icono del mnopi dentro de la barra de direcciones
		 sessionStorage['url'] = tab.url;
		 
		/*sendRequest(tab.url);
		sendRequestHTML(tab.url);
		sendRequestSearch(tab.url);
		sendRequestComments(tab.url);
			
		//chrome.windows.create({'url': 'index2.html', 'type': 'popup'}, function(window) {
			//alert(cadena);
   }
	    //alert(tab.url);*/
}



//Descomentar cuando funcione bien la parte del popup


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
        checkForValidUrl(tabId, changeInfo, tab); 
});