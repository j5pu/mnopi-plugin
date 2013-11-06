var remembered;
var email;
var pass;

var bgPage = chrome.extension.getBackgroundPage();

if (localStorage['visited'] == undefined) localStorage['visited'] = true;
if (localStorage['html'] == undefined) localStorage['html'] = true;
if (localStorage['search'] == undefined) localStorage['search'] = true; // TODO : repensar mejor

document.addEventListener('DOMContentLoaded', restore_option);

document.getElementById("remember").addEventListener('click', function(){
	localStorage["remembered"] = document.getElementById("remember").checked;
	localStorage["email"] = document.getElementById("inputEmail1").value;
	localStorage["pass"] = document.getElementById("inputPassword1").value;
}, true);


function restore_option() {
	var checkRemember = localStorage["remembered"];
	var fillMailLs = localStorage["email"];
	var fillPassLs = localStorage["pass"];
	
	if (checkRemember == "true")
	{
		document.getElementById("remember").checked = true;
		document.getElementById("inputEmail1").value = fillMailLs;
		document.getElementById("inputEmail1").style.background = "#ffffbd";
		document.getElementById("inputPassword1").value = fillPassLs;
		document.getElementById("inputPassword1").style.background = "#ffffbd";
	}
	else
	{
		document.getElementById("remember").checked = false;
		document.getElementById("inputEmail1").value = "";
		document.getElementById("inputEmail1").style.background = "white";
		document.getElementById("inputPassword1").value = "";
		document.getElementById("inputPassword1").style.background = "white";
		localStorage["email"] = "";
		localStorage["pass"] = "";
	}
}

window.onload = function()
{
	checkLS();

	var boton = document.getElementById('signin');
	//var botonOpt = document.getElementById('opciones');
	boton.onclick = start;
	//botonOpt.onclick = checkRem;
	if (bgPage.current == 2)
		bgPage.updateClicks();		
}

function start()
{
	remembered = document.getElementById("remember").checked;
	email = document.getElementById("inputEmail1").value;
	pass = document.getElementById("inputPassword1").value;
	
	localStorage["email"] = email;
	if (remembered)
		localStorage["pass"] = pass;
	else
		localStorage["pass"] = "";
	localStorage["remembered"] = remembered;

    var xhr = new XMLHttpRequest();
	var urlRest = MNOPI_SERVER_URL + POST_SERVICES['login']; //TODO: poner en constante bonita y tal o en fichero
	xhr.open("POST", urlRest, false); // síncrono
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send("user_key=" + email + ";password=" + pass)  //TODO: REFACTORIZAR
    if (xhr.status === 200) {
        window.close();
		if (bgPage.current == 1)
			bgPage.updateClicks();
    } else {
        alert("Error"); //TODO: Bug en chrome con los popups, poner el error en la propia pantalla del login
    }
	//xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    //xhr.send("{\"url\":\""+url+"\",\"idUser\":\""+localStorage["email"]+"\"}");
    //TODO: Poner un timer o algo para cuando haya timeout
}

function checkLS(){
	var total = 0;
	for(var x in localStorage) {
		var amount = (localStorage[x].length * 2) / 1024;
	  	total += amount;
	  	//console.log( x + " = " + amount.toFixed(2) + " KB"); // Tamaño de cada entrada
	}
	console.log( "Total: " + total.toFixed(2) + " KB"); //Tamaño total
	if (total.toFixed(2) > 100) //Se borran los registros de los comentarios a partir de 100K
	{
		var i=0;
		while(i<localStorage.length)
		{
			var obj = localStorage.getItem(localStorage.key(i));
			if (obj == "stored")
				localStorage.removeItem(localStorage.key(i));
			else 
				i++;
		}
		
	}
}

