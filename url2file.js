/*function escribir(cadena){
	
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var write_id;
	write_id = "local.txt" ;
	var s = fso.CreateTextFile(write_id, true);
	
	s.WriteLine(cadena);
	s.Close();
}


function sendRequestHTML(url) {
	
	var request = new XMLHttpRequest();
	request.callback = function(){
		escribir(cadena);
	};
	request.open("GET", url, true);
	request.send(null);
	request.onreadystatechange = readResponse2;
}

function readResponse2() {
	alert("aqui");
  if (this.readyState == 4) {
      if(this.status == 0) {
        throw('Status = 0');
      }
 
	cadena = this.responseText; //aqui esta el html de la web --> hacer un post con este dato
	this.callback();
}
}
var ids = 377525;
for (var i = ids;i<=377525;i++)
sendRequestHTML("http://www.icsc.org/member/profile/"+i);*/



 /*$('.display-email').click(function(e) {
                e.preventDefault();
                member_id = $(this).data('member-id');*/
               var member_id = 377525;
                
                
                $.ajax({
                	
                	url: 'http://www.icsc.org/_partials/display-email',
                	type: 'POST',
                	data: {member_id: member_id},
                	//crossDomain: true,
                	dataType: 'jsonp',
                	//contentType: 'text/html',
                	success: function(data, textStatus, xhr) {
	                	console.log('bien!!');
	                        $('.display-email').html(data);
	                        $('.display-email').attr('href', 'mailto:' + data);
	                        $('.display-email').unbind('click');
                    },
                    error: function(data, a, b, c){
                    	console.log('mal!!');
                    }
                });
               
               
               /*$.jsonp({
			      "url": "http://www.icsc.org/_partials/display-email",
			      "data": {
			          "member_id": "23"
			      },
			      "success": function(data) {
			          // handle user profile here 
			          console.log('bien!!');
			      },
			      "error": function(d,msg) {
			          alert("Could not find user "+26);
			      }
			    });*/


                //return false;
            //});


