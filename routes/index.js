//Handles page routes

var db = require('../db.js'),
	_ = require('underscore');

function getUser(user) {
	if (!user) {
		return {
			name : 'Guest'
		}
	} else {
		return {
			username: user.username,
			name: user.name
		}
	}
}


exports.index = function(req, res) {
	var user = getUser(req.user)
	res.render('index', {
		id: '',
		user: user
	});
};

exports.register = function(req, res) {
	var user = getUser(req.user)
	res.render('register', {
		id: 'register',
		user: user
	});
}

exports.login = function(req, res) {
	var user = getUser(req.user)
	res.render('login', {
		id: 'login',
		user: user
	})
}


exports.maps = function(req, res) {
	var user = getUser(req.user)
	if (req.params.slug) {
		db.Map.find({
			slug: req.params.slug
		}).exec(function(err, doc) {
			if (err) {
				console.log(err);
			}
			console.log(doc.length)
			//res.send(doc);
			if (doc.length === 0) {
				res.status(404)
				res.render('partials/404', {
					id: '404'
				})
			} else {
				res.render('map', {
					id: 'maps',
					name: req.params.slug,
					user: user,
					mapdoc: doc[0]
				});
			}
			return;
		})
	} else {
		res.render('maps', {
			id: 'maps',
			user: user
		});
	}
};

exports.createmap = function(req, res) {
	var user = getUser(req.user)
	console.log(user)
	res.render('createmap', {
		id: 'maps',
		user: user
	});
};

exports.notfound = function(req, res) {
	res.render('partials/404', {
		id: '404'
	})
};