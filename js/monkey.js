//define(['jquery', 'gmaps', 'marker'], function($, m) {

(function() {

	document.getElementById("results").innerHTML = 'WTF';

	console.log('widget');

	const SEPTA_URL = 'http://www3.septa.org/hackathon/TrainView/?callback=?',
		  REFRESH_RATE = 30000; // millisecs - 5 seconds

	var	dataOptions = { },
		refresh = false,  // Defaults to not automatically refresh
		selectedDestination = "Warminster",  // Defaults to Warminster station
		jsonData = [],
		//googleMap = m,
		septaStationUrl = "http://www.septa.org/stations/rail/",
		nextStop;

	getData(); // Load the JSON data
	
	////////////////////////////////
	// FUNCTIONS
	////////////////////////////////

	function getData() {
		// Set data values
		$("label").html("Auto Refresh <span class='subtle'>- every " + REFRESH_RATE/1000 + " seconds</span>");
		//return 
		console.log('displayData');
		$("#ajax").append('getData');
		$.getJSON(SEPTA_URL, dataOptions, displayData);
	}

	function displayData(data) {


		$("#ajax").append('displayData');

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
			selectedDestination = reformatDestination(harshVarSplit, 'ugly');
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

					var trainLatlng = new google.maps.LatLng(parseFloat(item.lat),parseFloat(item.lon));

					var mapOptions = {
				          center: trainLatlng,
				          zoom: 16
				        };

			        var map = new google.maps.Map(document.getElementById('map-canvas'+i), mapOptions);

			        /*var marker = new google.maps.Marker({
					    position: trainLatlng,
					    map: map,
					    title:"I'm here!"
					});

			        marker.setMap(map);*/

			        // Add custom marker with train number
			        var marker1 = new MarkerWithLabel({
				       position: trainLatlng,
				       draggable: true,
				       raiseOnDrag: true,
				       map: map,
				       labelContent: "#" + item.trainno,
				       labelAnchor: new google.maps.Point(22, -5),
				       labelClass: "trainLabel", // the CSS class for the label
				       labelStyle: {opacity: 0.75},
				     });

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
	} // End displayData function

	// Builds the train ul 
	function trainItem(train, inc) {

		$("#ajax").append('trainItem');

		var output = "",
			nextStop = train.nextstop,
			late = train.late;

		output += "<ul class='train'>";

		output += "<li class='stop-info'><a target='_blank' href='"+ getStationStopLink(nextStop) + "'><h4>Next Stop <stromg>" + reformatDestination(nextStop, 'pretty') + "</h4></a></li>";

		if(late === 0) {
			output += "<li class='status bg-success'>The train is not late.</li>";
		} else if(late === 1) {
			output += "<li class='status bg-danger'>It's running " + late + " minute late.</li>";
		} else {
			output += "<li class='status bg-danger'>It's running " + late + " minutes late.</li>";
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

	// Formats the station copy to ugly match with JSON or pretty display for correct station URL
	function reformatDestination($destination, $style) {
		var destination = $destination.split(' '),
			style = $style,
			len = destination.length,
			rejoinDest;

		if(style === "ugly") {	
			for(var i=0; i<len; i++) {
				if(destination[i] === "Hill") {
					destination[i] = "H";
				}
			}
		} 
		if(style === "pretty") {
			for(var i=0; i<len; i++) {
				switch(destination[i]) {
					case "H":
						destination[i] = "Hill";
						break;
					case "Jct":
						destination[i] = "Junction";
						break;
					case "U":
						destination[i] = "University";
						break;
					case "St":
						destination[i] = "Street";
						break;
					case "Terminal":
						destination[i] = "";
						break;
					case "A":
						destination[i] = "";
						break;
				}
			}
		}

		//console.log(destination.join(' '))
		rejoinDest = destination.join(' ');
		return destination.join(' '); 
	}

	// Get next station stop information link
	function getStationStopLink($stop) {

		$("#ajax").append('getStationStopLink');
		var nextStop = $stop;
		var url = reformatDestination(nextStop, 'pretty').replace(/ /g,'').toLowerCase();
		return septaStationUrl + url + '.html';
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
		//console.log('display data = ' + jsonData)

		displayData(jsonData);
	});

	////////////////////////////////
	// END EVENTS
	////////////////////////////////

//});

})();
