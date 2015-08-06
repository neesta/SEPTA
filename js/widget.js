define(['jquery', 'gmaps'], function($, m) {

	'use strict';

	const SEPTA_URL = 'http://www3.septa.org/hackathon/TrainView/?callback=?',
		  REFRESH_RATE = 30000; // millisecs - 5 seconds

	var	dataOptions = { },
		refresh = false,  // Defaults to not automatically refresh
		selectedDestination = "Warminster",  // Defaults to Warminster station
		jsonData = [],
		googleMap = m;

	getData(); // Load the JSON data
	
	////////////////////////////////
	// FUNCTIONS
	////////////////////////////////

	function getData() {
		// Set data values
		$("label").html("Auto Refresh <span class='subtle'>- every " + REFRESH_RATE/1000 + " seconds</span>");
		return $.getJSON(SEPTA_URL, dataOptions, displayData);
	}

	function displayData(data) {

		var hashVar = document.location.hash,
		 	harshVarSplit = hashVar.split('#')[1],
		 	totalTrains = 0,
		 	output = '',
			displayArray = [];

	 	jsonData = data;

		// Get the # value and adjust destination if different from default
		if(hashVar != selectedDestination && hashVar != '') {
			$(".select-destination").val(harshVarSplit);
			//console.log(document.location.hash.split('#')[1]);
			$('.destinationTxt').html(harshVarSplit);
			selectedDestination = cleanUpDestination(harshVarSplit);
		}

		// Set the page title
		document.title = 'SEPTA ' + selectedDestination + ' Station Rundown';

		$.each(jsonData, function(i,item){

			//console.log(item.dest);

			var destination = item.dest;

			// Build the div

			if(destination === selectedDestination) {

				totalTrains++;

				var wrapper = "<div class='col-xs-12 col-md-6'>" + trainItem(item, i) + "</div>";

				displayArray.push(wrapper);
			}

		});

		if(totalTrains >= 1) {

			//displayArray.reverse();

			$("#ajax").html(displayArray);

			$.each(jsonData, function(i,item){

				var destination = item.dest;

				if(destination === selectedDestination) {

					var myLatlng = new m.LatLng(parseFloat(item.lat),parseFloat(item.lon));

					var mapOptions = {
				          center: myLatlng,
				          zoom: 16
				        };

			        var map = new googleMap.Map(document.getElementById('map-canvas'+i), mapOptions);

			        var marker = new google.maps.Marker({
					    position: myLatlng,
					    map: map,
					    title:"I'm here!"
					});

			        marker.setMap(map);

			        // Center train location position on resize
			        googleMap.event.addDomListener(window, "resize", function() {
						 var center = map.getCenter();
						 googleMap.event.trigger(map, "resize");
						 map.setCenter(center); 
					});

			    }

	        });
		} else {

			output = "<br><br><h5>Well it looks like there aren't any trains currently headed towards " + selectedDestination + "</h5>";

			$("#ajax").html(output);

		}	
	} // End displayData function

	// Builds the train ul 
	function trainItem(train, inc) {

		var output = "";

		output += "<ul class='train'>";

		output += "<li class='stop-info'><h4>Next Stop <stromg>" + train.nextstop + "</h4></li>";

		if(train.late === 0) {
			output += "<li class='status bg-success'>The train is not late.</li>";
		} else if(train.late === 1) {
			output += "<li class='status bg-danger'>It's running " + train.late + " minute late.</li>";
		} else {
			output += "<li class='status bg-danger'>It's running " + train.late + " minutes late.</li>";
		}

		output += "<li><div id='map-canvas" + inc +"'></div></li>";

		output += "</li></ul>";

		return output;
	}

	// Renames the Chestnut Hill destination text 
	function cleanUpDestination($d) {
		var cleanDestination = $d;
		if(cleanDestination == "Chestnut Hill West") {
			cleanDestination = "Chestnut H West";
		} else if(cleanDestination == "Chestnut Hill East") {
			cleanDestination = "Chestnut H West";
		}

		return cleanDestination; 
	}

	////////////////////////////////
	// END FUNCTIONS
	////////////////////////////////

	////////////////////////////////
	// EVENTS
	////////////////////////////////

	$("#autoRefresh").change(function(){
		if( $(this).prop( "checked" ) ) {
			refresh = true;
		} else {
			refresh = false;
		}
	});

	// Refresh the json train data
	var refreshId = setInterval(function()
    {
        if(refresh) getData(); // Refresh the JSON data
    }, REFRESH_RATE);

	// Check dropdown menu for changes
	$(".select-destination").change(function(){
		selectedDestination = $(this).val();
		//$('.desitinationTxt').html(selectedDestination);
		//console.log(selectedDestination);
		
		document.location.hash = selectedDestination;
		console.log('display data = ' + jsonData)

		displayData(jsonData);
	});

	////////////////////////////////
	// END EVENTS
	////////////////////////////////

});

