'use strict';

/* Controllers */


angular.module('atlMaps.controllers', []).
controller('MyCtrl1', [
	function() {

	}
])
	.controller('MyCtrl2', [
	function() {

	}
]);

function LoginCtrl($scope, $http) {


	$scope.login = function() {
		$http.post('/login')
	}

}

function MapHomeCtrl($scope, Maps) {
	$scope.maps = [
		[]
	];
	Maps.query(function(maps) {
		var j = 0;
		$.each(maps, function(i, val) {
			$scope.maps[j].push(val)
			if ($scope.maps[j].length == 3) {
				$scope.maps.push([])
				j++;
			}

		})
	});
};

function MapViewCtrl($scope, Map, LayerById, $window, $timeout) {

	$scope.mapInfoOpen = true;
	$scope.popupInfo = false;
	$scope.layersInfo = false;
	$scope.map = {
		layers: []
	};
	$scope.mapInfo;
	$scope.center;
	$scope.mapLayers = [];
	$scope.mapLayerObj = [];
	$scope.popupContent = {};

	$scope.toggleLayer = function(layer) {
		if (layer.status) {
			map.addLayer($scope.mapLayerObj[layer.index]);
		} else {
			map.removeLayer($scope.mapLayerObj[layer.index]);
		}
	}

	$scope.changeOpacity = function(layer) {
		if ($scope.mapLayerObj[layer.index]) {
			$scope.mapLayerObj[layer.index].setOpacity(layer.opacity / 100);
		}
	}

	$scope.init = function(name, mapdoc) {
		$scope.mapInfo = mapdoc;
		$.each($scope.mapInfo.layers, function(i, val) {
			LayerById.query({
				id: val.id
			}, function(layerResult) {
				if (val.status) {
					layerResult[0].status = val.status
				}
				if (val.opacity) {
					layerResult[0].opacity = val.opacity
				}
				$scope.map.layers.push(layerResult[0])
			})
		});

		var updateMap = function() {
			$scope.map.zoom = $scope.mapInfo.zoom;
			$scope.map.center = $scope.mapInfo.center;
		}

		$timeout(updateMap, 500)
	}

	$scope.openAcc2 = function() {
		// console.log($scope.acc1open, $scope.acc2open, $scope.acc3open)
		$scope.popupInfo = true;
	}

	$scope.mapWidth = function() {
		return $(window).width() - 360;
	}

	$scope.pageHeight = function() {
		return $(window).height() - 40;
	}

	$scope.mapTypeIcon = function(type) {
		switch (type) {
			case 'geojson':
				return 'icon-map-marker'
				break
			case 'wms':
				return 'icon-globe'
				break
			case 'planningatlanta':
				return 'icon-globe';
				break
		}
	}


}

function MapCreateCtrl($scope, Map, LayerById, $window, Collections, LayersByCollection, Layers, $filter) {
	$scope.mapInfoOpen = true;
	$scope.popupInfo = false;
	$scope.layersInfo = false;
	$scope.addLayersInfo = false;

	$scope.collections;
	$scope.map = {
		layers: []
	};
	$scope.open = true;
	$scope.currentCollection;
	$scope.allLayers;
	$scope.layerFilter = '';
	$scope.mapLayerObj = [];
	$scope.popupContent = {};

	$scope.init = function() {
		Collections.query(function(result) {
			$scope.collections = result;
		})
	}

	$scope.isDisabled = function(){
		if ($scope.map.name && window.user !== "Guest"){
			return false;
		}else{
			return true;
		}
		
	}

	$scope.saveMap = function() {
		$scope.map.center = map.getCenter();
		$scope.map.zoom = map.getZoom();

		if ($scope.map.$valid) {
			console.log($scope.mapForm.$valid)
		}
		Map.update(
			$scope.map, function(result) {
			// console.log('err: ' + err);
			// console.log('res: ' + result);
			console.log(result)
			if (result.success) {
				window.location = '/maps/' + result.doc.slug
			}
		})
	}

	$scope.removeLayer = function(layer, i) {
		map.removeLayer($scope.mapLayerObj[layer.index]);
		console.log(i)
		$scope.map.layers.splice(i, 1);
		// console.log($scope.map.layers)
	}

	$scope.openLayerCollection = function(target) {
		$scope.currentCollection = target;
		//console.log(target)
		LayersByCollection.query({
			id: $scope.currentCollection._id
		}, function(result) {
			$scope.currentCollection.layers = result;
			$("#collectionLayerModal").modal();
		})
	}

	$scope.openLayerSearch = function() {
		Layers.query(function(results) {
			$scope.allLayers = results;
			$('#layerSearchModal').modal();
		})
	}

	$scope.toggleLayer = function(layer) {
		if (layer.status) {
			map.addLayer($scope.mapLayerObj[layer.index]);
		} else {
			map.removeLayer($scope.mapLayerObj[layer.index]);
		}
	}

	$scope.changeOpacity = function(layer) {
		if ($scope.mapLayerObj[layer.index]) {
			$scope.mapLayerObj[layer.index].setOpacity(layer.opacity / 100);
		}
	}

	$scope.mapWidth = function() {
		return $(window).width() - 360;
	}

	$scope.pageHeight = function() {
		return $(window).height() - 40;
	}

	$scope.mapTypeIcon = function(type) {
		switch (type) {
			case 'geojson':
				return 'icon-map-marker'
				break
			case 'wms':
				return 'icon-globe'
				break
			case 'planningatlanta':
				return 'icon-globe';
				break
		}
	}
}

MapHomeCtrl.$inject = ['$scope', 'Maps'];
LoginCtrl.$inject = ['$scope', '$http']
MapViewCtrl.$inject = ['$scope', 'Map', 'LayerById', '$window', '$timeout']
MapCreateCtrl.$inject = ['$scope', 'Map', 'LayerById', '$window', 'Collections', 'LayersByCollection', 'Layers', '$filter']