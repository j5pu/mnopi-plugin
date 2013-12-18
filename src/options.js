
// Saves options to localStorage.
function save_options() {
	var visited = document.getElementById("sendPageVisited").checked;
	var html = document.getElementById("sendHTMLVisited").checked;
	var comments = document.getElementById("sendComments").checked;
	var search = document.getElementById("sendSearch").checked;

	localStorage["visited"] = visited;
	localStorage["html"] = html;
	localStorage["comments"] = comments;
	localStorage["search"] = search;
	
	// Update status to let user know options were saved.
	var saved = document.getElementById("saved");
	saved.style.color = "white";
	setTimeout(function() {
    	saved.style.color="#80c1df";
  	}, 1250);
 	return false; 	
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	var checkVisited = localStorage["visited"];
	var checkHtml = localStorage["html"];
	var checkComments = localStorage["comments"];
	var checkSearch = localStorage["search"];

	if (checkVisited == "true")
		document.getElementById("sendPageVisited").checked = true;
	else if (checkVisited == "false")
		document.getElementById("sendPageVisited").checked = false;
	
	if (checkHtml == "true")
		document.getElementById("sendHTMLVisited").checked = true;
	else if (checkHtml == "false")
		document.getElementById("sendHTMLVisited").checked = false;

	if (checkComments == "true")
		document.getElementById("sendComments").checked = true;
	else if (checkComments == "false")
		document.getElementById("sendComments").checked = false;
	
	if (checkSearch == "true")
		document.getElementById("sendSearch").checked = true;
	else if (checkSearch == "false")
		document.getElementById("sendSearch").checked = false;
}


document.addEventListener('DOMContentLoaded', restore_options);
var botonOpt = document.getElementById('save');
botonOpt.onclick=save_options;
//document.querySelector('#save').addEventListener('click', save_options);