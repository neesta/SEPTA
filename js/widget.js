

$(document).ready(function(){

		var septaURL = 'http://www3.septa.org/hackathon/TrainView/?callback=?',
			refreshRate = 550000 // millisecs
			dataOptions = { },
			refresh = false,
			selectedDestination = "Warminster",
			jsonData = [];

		function displayData(data) {

			//var data = data;
			//alert(data[2].dest);

			jsonData = data;
			var output = "";
			var totalTrains = 0;

			$.each(jsonData, function(i,item){

				//console.log(item.dest);

				var destination = item.dest;

				// Build the div

				if(destination === selectedDestination) {

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

				$.each(jsonData, function(i,item){

					var destination = item.dest;

					if(destination === selectedDestination) {

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

				output = "<br><br><h5>Well it looks like there aren't any trains currently headed towards " + selectedDestination + "</h5>";

				$("#ajax").html(output);

			}	
		}; // End displayData function

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

		// Check if refresh is set to true
		if(refresh) {	
			var refreshId = setInterval(function()
		    {
		        $.getJSON(septaURL, dataOptions, displayData);
		        //alert('refresh');
		    }, refreshRate);
		}

		// Check dropdown menu for changes
		$(".select-destination").change(function(){
			selectedDestination = $(this).val();
			$('.desitinationTxt').html(selectedDestination);
			//console.log(selectedDestination);
			if(selectedDestination == "Chestnut Hill West") {
				selectedDestination = "Chestnut H West";
			} else if(selectedDestination == "Chestnut Hill East") {
				selectedDestination = "Chestnut H West";
			}
			displayData(jsonData);
		})


});  // End doc.ready

