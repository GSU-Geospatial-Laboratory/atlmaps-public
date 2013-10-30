var mongoose = require('mongoose')
var db = require('../db.js');
var slug = require('slug')
var moment = require('moment');
var async = require('async');
var _ = require('underscore');
var request = require('request');
var xml2js = require('xml2js');

var parser = new xml2js.Parser({
	mergeAttrs: true
});



var data = require('./metadata.json')

//console.log(data)

db.Layer.collection.remove(function(err) {
	console.log(err)
})
db.LayerCollection.collection.remove(function(err) {
	console.log(err)
})
db.Map.collection.remove(function(err) {
	console.log(err)
})

async.waterfall([
	function(callback) {
		var collection1 = 'Planning Atlanta - Historic Maps'
		var collid1 = []
		var coll1 = new db.LayerCollection({
			name: collection1,
			slug: slug(collection1).toLowerCase()
		}).save(function(err, doc) {
			collid1.push(doc._id)
			callback(null, collid1);
		})

	},
	function(collid1, callback) {
		var collection2 = 'User created'
		var collid2 = []
		var coll2 = new db.LayerCollection({
			name: collection2,
			slug: slug(collection2).toLowerCase()
		}).save(function(err, doc) {
			collid2.push(doc._id)
			callback(null, collid1, collid2);
		})
	},
	function(collid1, collid2, callback) {
		var collection3 = "Historic Bird's Eye View Maps"
		var collid3 = []
		var coll2 = new db.LayerCollection({
			name: collection3,
			slug: slug(collection3).toLowerCase()
		}).save(function(err, doc) {
			collid3.push(doc._id)
			callback(null, collid1, collid2, collid3);
		})
	},
	function(collid1, collid2, collid3, callback) {
		var collection4 = "Living Walls"
		var collid4 = []
		var coll2 = new db.LayerCollection({
			name: collection4,
			slug: slug(collection4).toLowerCase()
		}).save(function(err, doc) {
			collid4.push(doc._id)
			callback(null, collid1, collid2, collid3, collid4);
		})
	},
	function(collid1, collid2, collid3, collid4, callback) {
		var layers = []
		_.each(data, function(val, i) {
			var date = ''
			if (val.date.length > 0) {
				var date = moment(val.date).toDate()
			}
			request({
				url: 'http://static.library.gsu.edu/ATLmaps/tiles/' + val.number + '/tilemapresource.xml'
			}, function(error, response, body) {
				parser.parseString(response.body, function(err, result) {
					setTimeout(function() {}, 1000);

					if (result == undefined) {
						console.log(val)
						return;
					}
					var bbox = result.TileMap.BoundingBox[0];
					var zoomlevels = [];
					_.each(result.TileMap.TileSets[0].TileSet, function(z, i) {
						zoomlevels.push(z.href)
					})

					var date = ''
					if (val.date != undefined && !! val.date) {
						date = moment(val.date).toDate()
					}
					var layer1 = new db.Layer({
						name: val.name,
						slug: slug(val.name).toLowerCase(),
						keywords: val.keywords,
						description: val.description,
						url: 'http://www.atlmaps.com/geoserver/atlmaps/wms',
						layer: val.number,
						date: date,
						type: 'planningatlanta',
						layerCollection: collid1,
						zoomlevels: zoomlevels,
						bbox: bbox
					}).save(function(err, doc) {
						if (err) {
							console.log(err)
						}
						layers.push({
							status: true,
							opacity: 50,
							id: doc._id
						})
					})

				})

			})
		})
		console.log(collid1, collid2)
		callback(null, collid1, collid2, collid3, collid4);
	},
	function(collid1, collid2, collid3, collid4, callback) {
		var value = {
			"number": "atlpm0380_geo",
			"name": "Atlanta Airport 1967",
			"date": "1969",
			"description": "This topographic map of the Atlanta Airport, now Hartsfield-Jackson Atlanta International Airport, was created in 1967.",
			"keywords": "airport, 1969, hartsfield-jackson, Mountain View"
		}
		var layer1 = new db.Layer({
			name: value.name,
			slug: slug(value.name).toLowerCase(),
			keywords: value.keywords,
			description: value.description,
			url: 'http://www.atlmaps.com/geoserver/atlmaps/wms',
			layer: value.number,
			date: moment(value.date).toDate(),
			type: 'wms',
			layerCollection: collid1,
			//zoomlevels: zoomlevels,
			bbox: {
				minx: '-84.46091263400156',
				miny: '33.61212485887238',
				maxx: '-84.37832072077799',
				maxy: '33.665270651074124'
			}
		}).save(function(err, doc) {
			if (err) {
				console.log(err)
			}

			callback(null, collid1, collid2, collid3, collid4);
		})

	},

	function(collid1, collid2, collid3, collid4, callback) {
		var layername2 = 'Mountain View / Airport Points of Interest'

		var layer2 = new db.Layer({
			name: layername2,
			slug: slug(layername2).toLowerCase(),
			keywords: 'airport, Mountain View',
			url: '/',
			layer: 'data/hannahspoints.json',
			type: 'geojson',
			date: moment('2013', 'YYYY').toDate(),
			layerCollection: collid2
		}).save(function(err, doc) {
			if (err) {
				console.log(err)
			}
			callback(null, collid1, collid2, collid3, collid4);
		})

	},
	function(collid1, collid2, collid3, collid4, callback) {
		var layername2 = 'Historic Downtown Atlanta'

		var layer2 = new db.Layer({
			name: layername2,
			slug: slug(layername2).toLowerCase(),
			keywords: 'atlanta, historic downtown',
			url: '/',
			layer: 'data/historicdowntown.json',
			type: 'geojson',
			date: moment('2013', 'YYYY').toDate(),
			layerCollection: collid2
		}).save(function(err, doc) {
			if (err) {
				console.log(err)
			}
			callback(null, collid1, collid2, collid3, collid4);
		})
	},
	function(collid1, collid2, collid3, collid4, callback) {
		var years = ['2010', '2011', '2012', '2013']
		_.each(years, function(val, i) {
			var layername = 'Living Walls - ' + val

			var layer = new db.Layer({
				name: layername,
				slug: slug(layername).toLowerCase(),
				keywords: 'atlanta, living walls, street art',
				url: '/',
				layer: 'data/livingwalls_' + val + '.json',
				type: 'geojson',
				date: moment(val, 'YYYY').toDate(),
				layerCollection: collid4
			}).save(function(err, doc) {
				if (err) {
					console.log(err)
				}
			})
			callback(null, collid1, collid2, collid3, collid4);


		})

	},
	function(collid1, collid2, collid3, collid4, callback) {
		var bird = [{
			"number": "atl1871",
			"name": "Bird's-eye-view of the city of Atlanta, the capitol of Georgia 1871.",
			"date": "1871",
			"description": "Birds eye view of the city of Atlanta, the capitol of Georgia 1871. Drawn & published by A. Ruger. Looking north east.  From the Library of Congress.",
			"keywords": "atlanta, 1871, birds eye",
			"bbox": {
				"minx": "-84.41308472128767",
				"miny": "33.73061308763803",
				"maxx": "-84.37179754118307",
				"maxy": "33.77218988177499"
			}
		}, {
			"number": "atl1892",
			"name": "Bird's-eye-view of the city of Atlanta 1892",
			"date": "1892",
			"description": "Bird's eye view of Atlanta, Fulton Co., State capital, Georgia. Drawn by Aug. Koch. Hughes Litho. Co.  From the Library of Congress.",
			"keywords": "atlanta, 1892, birds eye",
			"bbox": {
				"minx": "-84.42316981203167",
				"miny": "33.72093178273286",
				"maxx": "-84.35028364430585",
				"maxy": "33.78831260483278"
			}
		}, {
			"number": "atl1919",
			"name": "Bird's-eye-view of the city of Atlanta, 1919.",
			"date": "1919",
			"description": "Bird's-eye-view.  From the Library of Congress.",
			"keywords": "atlanta, 1919, birds eye",
			"bbox": {
				"minx": "-84.40781509687399",
				"miny": "33.73437807969256",
				"maxx": "-84.37182057577523",
				"maxy": "33.77630647238566"
			}
		}]
		_.each(bird, function(value, i) {

			var layer1 = new db.Layer({
				name: value.name,
				slug: slug(value.name).toLowerCase(),
				keywords: value.keywords,
				description: value.description,
				url: 'http://www.atlmaps.com/geoserver/atlmaps/wms',
				layer: value.number,
				date: moment(value.date).toDate(),
				type: 'wms',
				layerCollection: collid3,
				//zoomlevels: zoomlevels,
				bbox: value.bbox
			}).save(function(err, doc) {
				if (err) {
					console.log(err)
				}
				//callback(null, collid1, collid2, collid3);
			})

		})

		callback(null, collid1, collid2, collid3, collid4);

	}



], function(err, result) {
	//done
});
// {
//         "number": "atlpm0009a",
//         "name": "Thomasville Urban Redevelopment Project, Atlanta, GA: Urban Redevelopent Plan",
//         "date": "October 27, 1958",
//         "description": "Cover page to a nine-sheet booklet.  Lists the individual drawings/maps.",
//         "keywords": "Atlanta, Urban Renewal"
//     }, 
// {
//         "number": "atlpm0380_geo",
//         "name": "Atlanta Airport 1967",
//         "date": "1969",
//         "description": "This topographic map of the Atlanta Airport, now Hartsfield-Jackson Atlanta International Airport, was created in 1967.",
//         "keywords": "airport, 1969, hartsfield-jackson, Mountain View"
//     },