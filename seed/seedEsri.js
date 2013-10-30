var mongoose = require('mongoose')
var db = require('../db.js');
var slug = require('slug')
var moment = require('moment');
var async = require('async');
var _ = require('underscore');
var request = require('request');
var xml2js = require('xml2js');
var Terraformer = require('terraformer')

var baseUrl = 'http://services.arcgisonline.com/ArcGIS/rest/services/'
var baseUrlJson = baseUrl + 'Demographics?f=json'
// [{
// 		"number": "atlpm0006",
//         "name": "USA_1990-2000_Population_Change",
//         "date": "October 27, 1958",
//         "description": "",
//         "keywords": "Atlanta, Urban Renewal"
// }]


async.waterfall([
		function(callback) {
			db.LayerCollection.find({
				"name": "Esri Demographic Collection"

			}).exec(function(err, data) {
				var collid1 = []
				// console.log(data)
				if (data.length == 0) {
					var collection1 = 'Esri Demographic Collection'

					var coll1 = new db.LayerCollection({
						name: collection1,
						slug: slug(collection1).toLowerCase()
					}).save(function(err, doc) {
						collid1.push(doc._id)
						callback(null, collid1);
					})
				} else {
					// console.log(data[0]._id)
					collid1.push(data[0]._id)
					callback(null, collid1);
				}
			})
		},

		function(collid1, callback) {
			// console.log(collid1, callback)
			request(baseUrlJson, function(error, response, body) {
				// console.log(body.services)
				var data = JSON.parse(body)
				_.each(data.services, function(val, i) {
					var layerReqUrl = baseUrl + val.name + '/MapServer/' + '?f=json'
					// console.log(layerReqUrl)
					request(layerReqUrl, function(error, response, body) {
						var legend
						// console.log(body)
						var layerData = JSON.parse(body)
						// console.log(layerData.fullExtent)
						var min = new Terraformer.Point([layerData.fullExtent.xmin, layerData.fullExtent.ymin]);
						var max = new Terraformer.Point([layerData.fullExtent.xmax, layerData.fullExtent.ymax]);
						var bbox = {
							minx: min.toGeographic().coordinates[0],
							miny: min.toGeographic().coordinates[1],
							maxx: max.toGeographic().coordinates[0],
							maxy: max.toGeographic().coordinates[1]
						}
						var layerLegendUrl = baseUrl +val.name + '/MapServer/legend?f=json' 
						request(layerLegendUrl, function(error,response, body){
							legend = JSON.parse(body)
							// console.log(legend.layers[0].legend)
							legend = legend.layers[0].legend


						})

						db.Layer.find({
							"name": layerData.documentInfo.Title
						}).exec(function(err, data) {
							// console.log(collid1)
							if (data.length == 0) {
								var layer1 = new db.Layer({
									name: layerData.documentInfo.Title,
									slug: slug(layerData.documentInfo.Title).toLowerCase(),
									keywords: layerData.documentInfo.Keywords,
									description: layerData.documentInfo.Subject,
									url: baseUrl + val.name + '/MapServer',
									// layer: val.number,
									// date: date,
									type: 'esri-demographics',
									layerCollection: collid1,
									// zoomlevels: zoomlevels,
									bbox: bbox
								}).save(function(err, doc) {
								console.log('added')
								console.log(err)
									// if (err) {
									// 	console.log(err)
									// }
									// layers.push({
									// 	status: true,
									// 	opacity: 50,
									// 	id: doc._id
									// })
								})

							}else{
								console.log('already in')
							}
						})

					})
					// console.log(val)
				})
			})

		}
	],
	function(err, result) {
		//done
	});

// var layer1 = new db.Layer({
// 	name: val.name,
// 	slug: slug(val.name).toLowerCase(),
// 	keywords: val.keywords,
// 	description: val.description,
// 	url: 'http://www.atlmaps.com/geoserver/atlmaps/wms',
// 	layer: val.number,
// 	date: date,
// 	type: 'planningatlanta',
// 	layerCollection: collid1,
// 	zoomlevels: zoomlevels,
// 	bbox: bbox
// }).save(function(err, doc) {
// 	if (err) {
// 		console.log(err)
// 	}
// 	layers.push({
// 		status: true,
// 		opacity: 50,
// 		id: doc._id
// 	})
// })