var mongoose = require('mongoose')
var db = require('./db.js');
var slug = require('slug')
var moment = require('moment');


var layername1 = 'Hartsfield Jackson Airport';
var layername2 = 'Mountain View / Airport Points of Interest'
var layername3 = 'Downtown Atlanta, Decatur Street'
var collection1 = 'Planning Atlanta - Historic Maps'
var collection2 = 'User created content'

var mapname = "I'm from here";

var layers = [];
var userid;
var collid1 = []
var collid2 = []

db.Map.collection.remove(function(err) {
	console.log(err)
})
db.Layer.collection.remove(function(err) {
	console.log(err)
})
// db.User.collection.remove(function(err) {
// 	console.log(err)
// })
db.LayerCollection.collection.remove(function(err) {
	console.log(err)
})
var coll1 = new db.LayerCollection({
	name: collection1,
	slug: slug(collection1).toLowerCase()
}).save(function(err, doc) {
	collid1.push(doc._id)
	var coll2 = new db.LayerCollection({
		name: collection2,
		slug: slug(collection2).toLowerCase()
	}).save(function(err, doc) {
		collid2.push(doc._id)
		var layer3 = new db.Layer({
			name: layername3,
			slug: slug(layername3).toLowerCase(),
			description: 'A historic map of Downtown Atlanta (Decatur Street area) at an unknown time',
			keywords: 'atlanta, historic map',
			url: 'http://www.atlmaps.com/geoserver/atlmaps/wms',
			layer: 'atlpm0105_geo',
			bbox: {
				minx: -84.39632426017084,
				maxx: -84.38593241330601,
				miny: 84.38593241330601,
				maxy: 84.38593241330601
			},
			type: 'wms',
			layerCollection: collid1
		}).save(function(err, doc) {
			if (err) {
				//console.log(err)
				//console.log(doc.layerCollection)
			}
			var layer1 = new db.Layer({
				name: layername1,
				slug: slug(layername1).toLowerCase(),
				keywords: 'airport, 1969, historic map',
				description: 'This topographic map of the Atlanta Airport, now Hartsfield-Jackson Atlanta International Airport, was created in 1967. A digital copy of this map can be accessed from the Georgia State University Library’s Planning Atlanta: A New City in the Making, 1930s – 1990s digital collection. A print copy is also held at the Georgia State University Library.',
				url: 'http://www.atlmaps.com/geoserver/atlmaps/wms',
				layer: 'atlpm0380_geo',
				date: moment('1969', 'YYYY').toDate(),
				bbox: {
					minx: -84.55816727229502,
					maxx: -84.27682913510972,
					miny: 33.62569015706569,
					maxy: 33.90702829425099
				},
				type: 'wms',
				layerCollection: collid1
			}).save(function(err, doc) {
				if (err) {
					console.log(err)
				}
				layers.push({
					status: true,
					opacity: 50,
					id: doc._id
				})

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
					mongoose.disconnect()
					layers.push({
						//status: true,
						//opacity: 1,
						id: doc._id
					})
				})
					// var map1 = new db.Map({
					// 	name: mapname,
					// 	dateCreated: moment().toDate(),
					// 	slug: slug(mapname).toLowerCase(),
					// 	keywords: "Atlanta, Airport, Hartsfield",
					// 	description: "I'm From Here is about going home again, or what's left of it. A work of creative nonfiction, it combines memoir and investigative journalism to tell the story of my hometown, Mountain View, Georgia, and other erased places surrounding Atlanta's Hartsfield-Jackson International Airport, the \"busiest airport in the world.\" Many of the locations explored and documented in the book have been nearly erased from existence, so I created this map.",
					// 	user: 'mejackreed',
					// 	layers: layers,
					// 	center: ['33.63806091415167', '-84.42418098449707'],
					// 	zoom: 13
					// }).save(function(err) {
					// 	if (err) {
					// 		console.log(err)
					// 	}
					// 	mongoose.disconnect()
					// })
				//})



			})
		})
	})

})
