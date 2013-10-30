'use strict';

/* Directives */
String.prototype.toProperCase = function() {
	return this.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

angular.module('atlMaps.directives', [])
	.directive('appVersion', ['version',
		function(version) {
			return function(scope, elm, attrs) {
				elm.text(version);
			};
		}
	])
	.directive('setDefaultMap', function($timeout) {


		return {
			restrict: 'A',
			link: function(scope, elm, attrs) {
				scope.map = {
					layers: []
				}

				scope.$watch('map.layers', function(newOne, oldOne) {
					// console.log(newOne)
					if (newOne && oldOne && newOne.length > 0 && newOne.length > oldOne.length) {
						$timeout(function() {
							handleLayer(newOne[oldOne.length])
						}, 200)
					}
				}, true);

				scope.$watch('map.center', function(newOne, oldOne) {
					// console.log(newOne)
					if (newOne != undefined) {
						map.setView(scope.map.center, scope.map.zoom)
					}
				})


				$timeout(function() {
					var bingHybrid = new L.BingLayer("AuW0OT9ghpACpXmU8i57F0dUDVqZNdg3Wwn_i2CHzYOPs5lyEybY6bg3sJHv8RmJ", {
						type: 'AerialWithLabels',
					}).addTo(map).setZIndex(0)
					var bingRoad = new L.BingLayer("AuW0OT9ghpACpXmU8i57F0dUDVqZNdg3Wwn_i2CHzYOPs5lyEybY6bg3sJHv8RmJ", {
						type: 'Road',
					});
					var bingSate = new L.BingLayer("AuW0OT9ghpACpXmU8i57F0dUDVqZNdg3Wwn_i2CHzYOPs5lyEybY6bg3sJHv8RmJ", {
						type: 'Aerial',
					});
					var bingLayers = {
						"Hybrid": bingHybrid,
						"Roadmap": bingRoad,
						"Satellite": bingSate
					}
					//map.addLayer(bingHybrid)

					var layerControl = L.control.layers(bingLayers).addTo(map);
					var atlanta = ["33.755711", "-84.388372"];
					map.setView(atlanta, 11);

				})

				var updateInfo = function(e) {
					scope.popupInfo = true;
					scope.popupContent = e.target.feature.properties
					scope.$apply()
				};

				var createPlanningAtlantaLayer = function(layer, opacity, minZoom, maxZoom, bounds) {
					return new L.tileLayer('http://static.library.gsu.edu/ATLmaps/tiles/{layer}/{z}/{x}/{y}.png', {
						layer: layer,
						tms: true,
						opacity: opacity,
						minZoom: minZoom,
						maxZoom: maxZoom,
						bounds: bounds,
						errorTileUrl: '/images/none.png'
					})
				}

				var createWMSLayer = function(url, layer, opacity) {
					return new L.tileLayer.wms(url, {
						layers: layer,
						format: 'image/png',
						transparent: true,
						opacity: opacity,
						tiled: true
					});
				};

				var createGeoJSONLayer = function(data) {
					return new L.geoJson(data, {
						onEachFeature: function(feature, layer) {
							layer.on({
								click: updateInfo
							});
						}
					});
				};

				var createEsriLayer = function(data) {
					return new L.esri.tiledMapLayer(data.url, {
						minZoom: 0,
						maxZoom: 13,
						opacity: 1,
						onEachFeature: function(feature, layer) {}
					})
				}


				var handleLayer = function(layer) {
					switch (layer.type) {
						case 'planningatlanta':
							var i = scope.mapLayerObj.length;
							layer.index = i;
							var bounds = [
								[layer.bbox.minx, layer.bbox.miny],
								[layer.bbox.maxx, layer.bbox.maxy]
							]
							//console.log(layer)
							var zoom = {}
							zoom.min = layer.zoomlevels[0]
							zoom.max = layer.zoomlevels[layer.zoomlevels.length - 1]

							map.fitBounds(bounds)
							scope.mapLayerObj[i] = (createPlanningAtlantaLayer(layer.layer, 1, zoom.min, zoom.max, bounds))
							if (layer.status === undefined) {
								layer.status = true;
							}
							//console.log(scope.mapLayerObj[i])
							if (layer.status) {
								map.addLayer(scope.mapLayerObj[i])
								//console.log(scope.mapLayerObj[i])
								// var leafletID = scope.mapLayerObj[i]._leaflet_id
								// console.log(map._layers[leafletID])

								map._layers[scope.mapLayerObj[i]._leaflet_id].bringToFront()
							}

							if (layer.opacity) {
								scope.mapLayerObj[i].setOpacity(layer.opacity / 100)
							} else {
								layer.opacity = 100;
							}
							break;
						case 'wms':
							var i = scope.mapLayerObj.length;
							layer.index = i;
							scope.mapLayerObj[i] = (createWMSLayer(layer.url, layer.layer, 1))
							if (layer.status === undefined) {
								layer.status = true;
							}
							if (layer.status) {
								map.addLayer(scope.mapLayerObj[i])
								// console.log(scope.mapLayerObj[i])
								map._layers[scope.mapLayerObj[i]._leaflet_id].bringToFront()
							}

							if (layer.opacity) {
								scope.mapLayerObj[i].setOpacity(layer.opacity / 100)
							} else {
								layer.opacity = 100;
							}
							break;
						case 'esri-demographics':
							var i = scope.mapLayerObj.length;
							layer.index = i;
							scope.mapLayerObj[i] = (createEsriLayer(layer))
							if (layer.status === undefined) {
								layer.status = true;
							}
							if (layer.status) {
								map.addLayer(scope.mapLayerObj[i]);
								map._layers[scope.mapLayerObj[i]._leaflet_id].bringToFront();
							}

							if (layer.opacity) {
								scope.mapLayerObj[i].setOpacity(layer.opacity / 100)
							} else {
								layer.opacity = 100;
							}

							break;

						case 'geojson':
							scope.map.hasClickableContent = true;
							scope.popupContent.description = 'Click a marker on the map'
							if (layer.status === undefined) {
								layer.status = true;
							}
							$.getJSON(layer.url + layer.layer, function(data) {
								var i = scope.mapLayerObj.length
								layer.index = i;
								scope.mapLayerObj[i] = (createGeoJSONLayer(data))
								if (layer.status) {
									map.addLayer(scope.mapLayerObj[i])
									scope.mapLayerObj[i].bringToFront()
								}
							})
							break;
					}
				}
			}
		}
	})
	.directive('sameAs', function() {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$parsers.unshift(function(viewValue) {
					if (viewValue === scope[attrs.sameAs]) {
						ctrl.$setValidity('sameAs', true);
						return viewValue;
					} else {
						ctrl.$setValidity('sameAs', false);
						return undefined;
					}
				});
			}
		};
	})
	.directive('slider', function() {
		return {
			link: function(scope, element, attrs) {
				var $element = $(element);
				if (typeof(scope.layer.opacity) != 'undefined') {
					var currentOpacity = scope.layer.opacity
				} else {
					var currentOpacity = 100
				}
				element.noUiSlider({
					range: [0, 100],
					start: currentOpacity,
					handles: 1,
					step: 1,
					slide: function() {
						scope.layer.opacity = $(this).val();
						scope.changeOpacity(scope.layer);
						scope.$apply();
					}
				});
			}
		};
	})
	.directive('legend', function($http, $timeout, $compile) {
		return {
			transclude: true,
			scope: {
				layer: '='
			},
			compile: function(elem, attrs, transclude) {
				return function(scope, elem, attrs) {

					if (scope.layer.type == "esri-demographics") {

						// console.log(scope.layer)
						var render;
						$http.jsonp(scope.layer.url + '/1?f=json&callback=JSON_CALLBACK').success(function(data, status) {
							// console.log(data)
							render = data.drawingInfo.renderer
							// console.log(render)
							var legendElement = angular.element('<table class="legend" cellpadding="5">');
							legendElement.append('<tbody>')

							if (render.classBreakInfos) {
								var titleElement = angular.element('<div>' + render.field.replace('_', ' ').toProperCase() + '</div>');
								elem.css({
									'height': render.classBreakInfos.length * 30 + 30
								})
								_.each(render.classBreakInfos, function(val, i) {
									// console.log(val)
									legendElement.append('<tr><td class="legend-box" style="background-color: rgb(' + val.symbol.color[0] + ',' + val.symbol.color[1] + ',' + val.symbol.color[2] + ')"><td>' + val.label + '</td>')
								})
							}
							if (render.uniqueValueInfos) {
								var titleElement = angular.element('<div>' + render.field1.replace('_', ' ').toProperCase() + '</div>');
								elem.css({
									'height': render.uniqueValueInfos.length * 30 + 30
								})
								_.each(render.uniqueValueInfos, function(val, i) {
									// console.log(val)
									legendElement.append('<tr><td class="legend-box" style="background-color: rgb(' + val.symbol.color[0] + ',' + val.symbol.color[1] + ',' + val.symbol.color[2] + ')"><td>' + val.label + ' - ' + val.value + '</td>')
								})
							}

							elem.append(titleElement)
							elem.append(legendElement);
						})
						// var legendElement = angular.element('<table class="span4"><tr><td>yo</td><td>yes</td></tr><tr><td>yep</td><td>{{render}}</td></tr></table>');
						// elem.append(legendElement);
					}
				}

			}

		}
	})