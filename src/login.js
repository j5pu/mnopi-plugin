$(function(){
    checkLS();
    $('#signin').click(start)
})

function show_error(message){
    $('#errors').css({'display':''})
    $('#error_text').text(message)
}

function clear_error(message){
    $('#errors').css({'display':'none'})
}

function start()
{
	user = document.getElementById("inputUser").value;
	password = document.getElementById("inputPassword").value;

    if (user == ""){
        show_error("Insert user")
    } else if (password == ""){
        show_error("Insert password")
    } else {
        chrome.extension.getBackgroundPage().login(user, password, false)
    }
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

