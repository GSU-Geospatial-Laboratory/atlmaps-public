'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('atlMaps.services', ['ngResource'])
	.factory('Maps', function($resource) {
	return $resource('/api/maps', {
		query: {
			method: 'GET',
			isArray: true
		}
	});
})
	.factory('Map', function($resource) {
	return $resource('/api/map/:name', {
		query: {
			method: 'GET'
		}
	}, {
		update: {
			method: 'PUT'
		}
	});
})
	.factory('LayerById', function($resource) {
	return $resource('/api/layer/:id', {
		query: {
			method: 'GET'
		}
	});
})
	.factory('LayersByCollection', function($resource) {
	return $resource('/api/layers/collection/:id', {
		query: {
			method: 'GET',
			isArray: true
		}
	})
})
	.factory('Layers', function($resource) {
	return $resource('/api/layers', {
		query: {
			method: 'GET',
			isArray: true
		}
	});
})
	.factory('Collections', function($resource) {
	return $resource('/api/collections', {
		query: {
			method: 'GET',
			isArray: true
		}
	});
})
	.service('collectionsService', function() {
	var data = ['t', 'h'];
	var open = false;
	return {
		collections: function() {
			return data
		},
		isOpen: function() {
			return open;
		},
		open: function() {
			open = true;
			return open;
		},
		close: function() {
			open = false;
			return open;
		}
	}
})
//.value('version', '0.1');