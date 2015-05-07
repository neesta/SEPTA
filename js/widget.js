

$(document).ready(function(){

		var septaURL = 'http://www3.septa.org/hackathon/TrainView/?callback=?';
		var refreshRate = 550000 // millisecs
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

				// Build the div

				if(destination === "Warminster") {

					totalTrains++;

					output += "<ul class='train'>";

					output += "<li><h4>Next Stop = " + item.nextstop + "</h4></li>";

					if(item.late === 0) {
						output += "<li class='status bg-success'>The train is not late.</li>";
					} else if(item.late === 1) {
						output += "<li class='status bg-danger'>It's running " + item.late + " minute late.</li>";
					} else {
						output += "<li class='status bg-danger'>It's running " + item.late + " minutes late.</li>";
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

				        // Center train location position on resize
				        google.maps.event.addDomListener(window, "resize", function() {
							 var center = map.getCenter();
							 google.maps.event.trigger(map, "resize");
							 map.setCenter(center); 
						});

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
		 
		// Set another completion function for the request above
		jqxhr.complete(function() {
		  console.log( "second complete" );
		});

		//alert('clicked');


	var refreshId = setInterval(function()
    {
        $.getJSON(septaURL, dataOptions, displayData);
        //alert('refresh');
    }, refreshRate);


});  // End doc.ready

