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

/* Auto login if the user selected to be remembered */
//chrome.runtime.onStartup.addListener(autologin)

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
	boton.onclick = start;
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

    var jqxhr = $.ajax({
        url: MNOPI_SERVER_URL + POST_SERVICES['login'],
        type: 'post',
        data: "user_key=" + email + ";password=" + pass + ";version=" + PLUGIN_VERSION,
        timeout: 5000,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).done(function(response) {
            if (response == "ok"){
                $('#errors').css({'display':'none'})
                window.close();
                if (bgPage.current == 1){
                    bgPage.updateClicks();
                }
            } else if (response == "version_error"){
                $('#errors').css({'display':''})
                $('#error_text').text("Download the new plugin version! ")
            } else {
                $('#errors').css({'display':''})
                $('#error_text').text("Incorrect user/password ")
            }
        }
    ).fail(function(xhr, status, err) {
            if (status == 'timeout') {
                $('#errors').css({'display':''})
                $('#error_text').text("Timeout error ")
            } else {
                $('#errors').css({'display':''})
                $('#error_text').text("Error in server ")
            }
    });

    return false;

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

