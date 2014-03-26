$(function(){
    // Try automatic login
    if (localStorage['session_token'] != "" && localStorage['user'] != ""){
        login(localStorage['user'], localStorage['session_token'], true)
    }

    // Set default options if undefined
    if (localStorage['visited'] == undefined) localStorage['visited'] = true;
    if (localStorage['html'] == undefined) localStorage['html'] = true;
    if (localStorage['search'] == undefined) localStorage['search'] = true;

    sessionStorage["url"] = "";
})


//TODO: REFACTORIZAR VARIABLES GLOBALES DE LA MUERTE
var twitterMain = false;
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


function login_response(response){

    if (response.result == "OK"){

        localStorage['session_token'] = response.session_token;
        localStorage['user_resource'] = response.user_resource;

		chrome.tabs.onUpdated.addListener(sendInformation);

        closeChromePopup();
        chrome.browserAction.setIcon({'path': '/images/icon.png'});
        chrome.browserAction.setPopup({'popup': "/html/logout.html"});
        showNotification("Monitorizando", "Se ha conectado con el servidor de mnopi", "/images/icon48.png", 4000);

    } else if (response.reason == "CLIENT_OUTDATED" || response.reason == "CLIENT_ERROR"){
        showErrorOnPopup("Download the new plugin version!");
    } else if (response.reason == "INCORRECT_USER_PASSWORD"){
        showErrorOnPopup("Incorrect user/password");
    } else if (response.reason == "UNEXPECTED_SESSION"){
        // Most probably the session has expired. Login must be performed manually.
        return;
    }

}

function login_err(xhr, status, err){
    if (status == 'timeout'){
        showErrorOnPopup("Timeout error");
    } else {
        showErrorOnPopup("Error in server ")
    }
}

function login(username, key, renew) {

    var login_token = new Object();
    login_token.username = username;
    login_token.key = key;

    if (renew == true){
        login_token.renew = true;
    }

    login_token.client = PLUGIN_VERSION;

    localStorage['user'] = username;
    ajaxRequest(POST_SERVICES['login'], login_token, login_response, login_err)

}

function logout(){

    localStorage['user'] = "";
    localStorage['session_token'] = "";

    chrome.tabs.onUpdated.removeListener(sendInformation);

    showNotification("Mnopi desactivado", "Ya no se monitorizan los datos", "/images/icon_bw_48.png", 4000);
    chrome.browserAction.setIcon({'path': '/images/icon_bw_19.png'});
    chrome.browserAction.setPopup({'popup': "/html/login.html"})

}

function pageVisitedResponse(response){
    //TODO
    return;
}

function pageVisitedError(response){
    //TODO
    return;
}

function sendPageVisited(tabId, url, sendHtml)
{
    if (sendHtml){
        chrome.tabs.sendMessage(tabId, {'content': "getHtml"}, function(response) {
                var pageVisited = new Object();
                pageVisited.user = localStorage["user_resource"];
                pageVisited.url = url;
                pageVisited.html_code = response.htmlCode;
                pageVisited.date = $.format.date(new Date(), "yyyy-MM-dd HH:mm:ss");

                ajaxAuthRequest(POST_SERVICES["sendPageVisited"], pageVisited, localStorage['session_token'],
                    pageVisitedResponse, pageVisitedError)
            }
      )
    } else {
        var pageVisited = new Object();
        pageVisited.user = localStorage["user_resource"];
        pageVisited.url = url;
        pageVisited.date = $.format.date(new Date(), "yyyy-MM-dd HH:mm:ss");

        ajaxAuthRequest(POST_SERVICES["sendPageVisited"], pageVisited, localStorage["session_token"],
            pageVisitedResponse, pageVisitedError)
    }
}

function searchResponse(response){
    //TODO
    return;
}

function searchError(response){
    //TODO
    return;
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

        var searchData = new Object();
        searchData.search_results = url;
        searchData.search_query = query;
        searchData.user = localStorage["user_resource"];
        searchData.date = $.format.date(new Date(), "yyyy-MM-dd HH:mm:ss");

        ajaxAuthRequest(POST_SERVICES["sendSearch"], searchData,localStorage["session_token"],
            searchResponse, searchError);

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
		var cadena = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
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
		var cadena = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
		var testRE = cadena.match(/http:\/\/www.facebook.com\/<strong>(.*)/);

        var testRE2 = testRE[1].match(/<\/strong>(.*)/);
        userName = testRE[1];
        var cadenAux = testRE2[0];
        userName = userName.replace(cadenAux,'');
        userName = userName.toLowerCase();

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


function sendInformation(tabId, changeInfo, tab) {

    if (changeInfo.status == "complete") {

		var previousUrl = sessionStorage['url'];

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
		 				sendPageVisited(tabId, tab.url, localStorage['html'] == "true");
		 			} catch (e1) {
		 				console.log("Error en método SendPageVisited: " + e1);
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