

$(document).ready(function(){

		var septaURL = 'http://www3.septa.org/hackathon/TrainView/?callback=?';

		var dataOptions = { };

		function displayData(data) {

			//var data = data;
			//alert(data[2].dest);

			var d = data;
			var output = "";
			var totalTrains = 0;

			$.each(d, function(i,item){

				//console.log(item.dest);

				var destination = item.dest;

				if(destination === "Warminster") {

					totalTrains++;

					output += "<ul class='train'>";

					console.log("FUCK YES");

					output += "<li><h4>Next Stop = " + item.nextstop + "</h4></li>";

					if(item.late === 0) {
						output += "<li class='status bg-success'>Is it late? = No!</li>";
					} else {
						output += "<li class='status bg-danger'>Is it late? = " + item.late + " Minutes</li>";
					}

					output += "<li><div id='map-canvas" + i +"'></div></li>";

					output += "</li></ul>";

				}

			});

			if(totalTrains >= 1) {
				$("#ajax").html(output);

				$.each(d, function(i,item){

					var destination = item.dest;

					if(destination === "Warminster") {

						var myLatlng = new google.maps.LatLng(parseFloat(item.lat),parseFloat(item.lon));

						var mapOptions = {
					          center: myLatlng,
					          zoom: 16
					        };

				        var map = new google.maps.Map(document.getElementById('map-canvas'+i), mapOptions);

				        var marker = new google.maps.Marker({
						    position: myLatlng,
						    map: map,
						    title:"I'm here!"
						});

				        marker.setMap(map);

				    }

		        });
			} else {

				output = "<p>Well it looks like there aren't any trains currently headed towards Warminster";

				$("#ajax").html(output);

			}	
		}

		$.getJSON(septaURL, dataOptions, displayData);

		var jqxhr = $.getJSON( septaURL, function() {
		  console.log( "success" );
		})
		  .done(function() {
		    console.log( "second success" );
		  })
		  .fail(function() {
		    console.log( "error" );
		  })
		  .always(function() {
		    console.log( "complete" );
		  });
		 
		// Perform other work here ...
		 
		// Set another completion function for the request above
		jqxhr.complete(function() {
		  console.log( "second complete" );
		});

		//alert('clicked');


		/*$.ajax({
		  url: "http://www3.septa.org/hackathon/locations/get_locations.php?lon=-75.161&lat=39.95205&callback=?",

		 dataType: "jsonp",
		  success: function(data){
		    $.each(data, function(i,item){
		        var locname =item.location_name;
		        if( item.location_type== 'perk_locations')
		        {

		            if(item.location_data != null)
		             alert(item.location_data.location_id + ' ' +item.location_data.location_name);
		        }

		    });
		  }
		});*/


	var refreshId = setInterval(function()
    {
        $.getJSON(septaURL, dataOptions, displayData);
        //alert('refresh');
    }, 550000);




	/*function sendAJAX() {
		
		$.getJSON('data.json', function(response) {

			//alert(response);

			var html = '<div class="col-lg-3"><ul>';
			var cssRed = 'red';
			var cssGreen = 'green';

			$.each(response, function(index,value){
				html += '<li class="';
				if(value.inoffice) {
					html += cssRed;
				} else {
					html += cssGreen;
				}

				html += '">' + value.name + '</li>';
			});

			console.log(html);

			$('#ajax').html(html);

			TweenMax.to($('#load'), .5, {opacity:0});
	});

	};*/

}); 


/*
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
	if (xhr.readyState === 4) {

		var employees = JSON.parse(xhr.responseText);

		console.log(employees);

		return;

		if(xhr.status === 200) {

			document.getElementById('ajax').innerHTML = employees;

			displayJSON(employees);

		} else if (xhr.status === 404) {

			alert('WTF that file don\'t exist');

		}
		
	}
};

xhr.open('GET', 'data.json');
xhr.send();

function sendAJAX() {
	//alert('click');
	xhr.send();
	var btn = document.getElementById('load');//.style.display = 'none';
	TweenMax.to(btn, .5, {autoAlpha:0, onComplete:function(){
		btn.style.display = 'none';
	}});
};

function displayJSON($obj) {

	var html = '<div class="col-lg-3"><ul>';
	var cssRed = 'red';
	var cssGreen = 'green';

	for(var i=0; i<$obj.length; i++) {

		html += '<li class="';

		console.log($obj[i]['name']);

		if(!$obj[i]['inoffice']) {
			html += cssRed;
		} else {
			html += cssGreen;
		}

		html += '">' + $obj[i]['name'] + '</li>';
	
	}

	html += '</ul></div>';


	document.getElementById('ajax').innerHTML = html;

}



// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest() {
  // All HTML5 Rocks properties support CORS.
  var url = 'http://www3.septa.org/hackathon/TrainView/';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}*/
