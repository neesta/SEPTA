

$(document).ready(function(){

		var septaURL = 'http://www3.septa.org/hackathon/TrainView/?callback=?',
			refreshRate = 300000 // millisecs - 5 seconds
			dataOptions = { },
			refresh = false,  // Defaults to not automatically refresh
			selectedDestination = "Warminster",  // Defaults to Warminster station
			jsonData = [];

		function displayData(data) {

			if(document.location.hash != selectedDestination) {
				$(".select-destination").val(document.location.hash.split('#')[1]);
				//console.log(document.location.hash.split('#')[1]);
				$('.destinationTxt').html(document.location.hash.split('#')[1]);
				selectedDestination = cleanUpDestination(document.location.hash.split('#')[1]);
			}

			//var data = data;
			//alert(data[2].dest);

			jsonData = data;
			var output = "";
			var totalTrains = 0;
			var displayArray = [];

			$.each(jsonData, function(i,item){

				//console.log(item.dest);

				var destination = item.dest;

				// Build the div

				if(destination === selectedDestination) {

					totalTrains++;

					output = "";

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

					displayArray.push(output);

					console.log(displayArray)
				}

			});

			if(totalTrains >= 1) {

				//displayArray.reverse();

				$("#ajax").html(displayArray[0]);

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
		
		$("#autoRefresh").change(function(){
			if( $(this).prop( "checked" ) ) {
				refresh = true;
				$("label").html("Auto Refresh <span class='subtle'>- every 5 seconds</span>");
			} else {
				refresh = false;
				$("label").html("Auto Refresh");
			}
		});

		var refreshId = setInterval(function()
	    {
	        if(refresh) $.getJSON(septaURL, dataOptions, displayData);
	    }, refreshRate);

		// Check dropdown menu for changes
		$(".select-destination").change(function(){
			selectedDestination = $(this).val();
			//$('.desitinationTxt').html(selectedDestination);
			//console.log(selectedDestination);
			
			//splitURL = location.href.split('/');
			document.location.hash = selectedDestination;
			//history.pushState("#");

			/*$.each(splitURL, function(i){
				console.log(' -- ' + splitURL[i]);
			});*/

			//if()

			//console.log(splitURL);//getQueryStringValue( "#" ));
			//var newURL = splitURL[0] + "//" + splitURL[1];// + "www.example.com/#cbp=ajax/project.aspx?id=" + getQueryStringValue( "#" );

            //redirect to new page
            //location.href = newUrl;

			displayData(jsonData);
		});

		function cleanUpDestination($d) {
			destination = $d;
			if(destination == "Chestnut Hill West") {
				destination = "Chestnut H West";
			} else if(destination == "Chestnut Hill East") {
				destination = "Chestnut H West";
			}

			return destination; 
		}


});  // End doc.ready

