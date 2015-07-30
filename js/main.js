// Configure RequireJS

requirejs.config({
	baseUrl: "js",
	paths: {
		async: 'async',
		jquery: [
			'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min',
			'jquery.min' // Loads if CDN version fails
		],
		widget: 'widget'		
	}
});

define('gmaps', ['async!http://maps.google.com/maps/api/js?v=3&sensor=false'],
	function(){
    	return window.google.maps;
	}
);
