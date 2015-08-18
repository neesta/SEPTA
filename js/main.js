// Configure RequireJS

requirejs.config({
	baseUrl: "js",
	waitSeconds: 10,
	paths: {
		async: 'async',
		'jquery': [
			'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min',
			'jquery.min' // Loads if CDN version fails
		],
		'marker': [
			'http://google-maps-utility-library-v3.googlecode.com/svn/tags/markerwithlabel/1.1.9/src/markerwithlabel',
			'markerwithlabel'
		],
		'widget': 'widget'		
	},
	shim: {
		'jquery': {
			exports: '$'
		},
        'marker': {
            deps: ['gmaps'],
            exports: 'marker'
        }
    }
});

define('gmaps' , ['async!http://maps.google.com/maps/api/js?v=3&sensor=false'],
	function(){
    	return window.google.maps;
	}
);

requirejs(['jquery', 'gmaps', 'marker'], function($){
	console.log('bases loaded');
	require(['widget']);

});