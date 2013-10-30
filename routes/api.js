//Handles API routes

var db = require('../db')
var slug = require('slug')
var moment = require('moment');
var _ = require('underscore');
var webshot = require('webshot');



exports.saveMap = function(req, res) {
	var layers = [];
	//console.log(req.body.layers)
	_.each(req.body.layers, function(val, i) {
		layers.push({
			id: val._id,
			status: val.status,
			opacity: val.opacity
		})
	})

	var map = new db.Map({
		name: req.body.name,
		slug: slug(req.body.name).toLowerCase(),
		dateCreated: moment().toDate(),
		description: req.body.description,
		keywords: req.body.keywords,
		center: [req.body.center.lat, req.body.center.lng],
		zoom: req.body.zoom,
		user: req.user.name,
		layers: layers
	}).save(function(err, doc) {
		if (err) {
			console.log(err)
		} else {
			//creates a screenshot of the map after it is created
			webshot('http://127.0.0.1:3000/maps/' + doc.slug, 'public/images/thumbs/' + doc._id + '.jpg', {
				screenSize: {
					width: 1200,
					height: 800
				},
				streamType: 'jpg',
				renderDelay : 3000
			}, function(err) {
				console.log('saved image')
				console.log(err)
			});
			res.send({
				success: true,
				doc: doc
			})
		}
	})
}

exports.map = function(req, res) {
	db.Map.find({
		slug: req.params.slug
	}).exec(function(err, doc) {
		if (err) {
			console.log(err);
		}
		res.send(doc);
	})
}


//this needs work!!!
exports.maps = function(req, res) {
	if (req.params.user) {
		db.Map.find({
			user: req.params.user
		}).exec(function(err, doc) {
			if (err) {
				console.log(err)
			}
			res.send(doc)
		})
	}
	if (req.params.keyword) {
		var findKeyword = new RegExp(req.params.keyword, "i")
		db.Map.find({
			keywords: findKeyword
		}).exec(function(err, doc) {
			if (err) {
				console.log(err)
			}
			res.send(doc)
		})
	}

	db.Map.find({}).exec(function(err, doc) {
		if (err) {
			console.log(err)
		}
		res.send(doc)
	})
}

exports.layers = function(req, res) {
	console.log(req.params)
	//if (req.params != null) {
	if (req.params.type) {
		db.Layer.find({
			type: req.params.type
		}).exec(function(err, doc) {
			if (err) {
				console.log(err)
			}
			res.send(doc)
		})
	}
	if (req.params.keyword) {
		var findKeyword = new RegExp(req.params.keyword, "i")
		db.Layer.find({
			keywords: findKeyword
		}).exec(function(err, doc) {
			if (err) {
				console.log(err)
			}
			res.json(doc)
		})
	}
	if (req.params.collection) {
		//console.log('col')
		db.Layer.find({
			layerCollection: req.params.collection
		}).exec(function(err, doc) {
			if (err) {
				console.log(err)
			}
			res.json(doc)
		})
	}



}
exports.allLayers = function(req, res) {
	db.Layer.find({}).exec(function(err, doc) {
		if (err) {
			console.log(err)
		}
		res.send(doc)
	});
}

exports.layer = function(req, res) {
	db.Layer.find({
		_id: req.params.id
	}).exec(function(err, doc) {
		if (err) {
			console.log(err);
		}
		res.send(doc);
	});
};

exports.collections = function(req, res) {
	if (req.params.collection) {
		db.LayerCollection.find({
			slug: req.params.collection
		}).exec(function(err, doc) {
			if (err) {
				console.log(err);
			}
			res.send(doc);
		});
	} else {
		db.LayerCollection.find().exec(function(err, doc) {
			if (err) {
				console.log(err);
			}
			res.send(doc);
		});
	}
}