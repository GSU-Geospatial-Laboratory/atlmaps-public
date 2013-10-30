var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

slug = require('slug')

var uristring = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/atlmaps';
exports.uristring = uristring

var mongoOptions = {
	db: {
		safe: true
	}
};

var db = mongoose.connect(uristring, mongoOptions, function(err, res) {
	// if (err) {
	// console.log('ERROR connecting to: ' + uristring + '. ' + err);
	// } else {
	// console.log('Succeeded connected to: ' + uristring);
	// }
});

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var geo = new Schema({
	loc: {
		type: [Number],
		index: '2dsphere'
	}
});

var collectionSchema = new Schema({
	name: {
		type: String
	},
	slug: {
		type: String
	}
});


var layerSchema = new Schema({
	name: {
		type: String
	},
	slug: {
		type: String
	},
	description: {
		type: String
	},
	date: {
		type: Date
	},
	keywords: {
		type: String
	},
	url: {
		type: String
	},
	layer: {
		type: String
	},
	layerCollection: [{
			type: Schema.ObjectId,
			ref: 'LayerCollection'
		}
	],
	bbox: {},
	zoomlevels: [],
	type: {
		type: String
	}
	// TODO add bounds
});

var userSchema = new Schema({
	email: {
		type: String
	},
	username: {
		type: String
	},
	name : {
		type: String
	}
})

userSchema.plugin(passportLocalMongoose);


var mapSchema = new Schema({
	name: {
		type: String
	},
	slug: {
		type: String,
		unique: true
	},
	featured: {
		type: Boolean,
		default: false
	},
	dateCreated: {
		type: Date
	},
	description: {
		type: String
	},
	keywords: {
		type: String
	},
	layers: [{
			id: {
				type: Schema.ObjectId,
				ref: 'Layer'
			},
			status: {
				type: Boolean
			},
			opacity: {
				type: Number
			}
		}
	],
	user: {
		type: String
	},
	center: {
		type: Array,
		index: '2dsphere'
	},
	zoom: {
		type: Number
	}
});


exports.LayerCollection = mongoose.model('LayerCollections', collectionSchema)
exports.Layer = mongoose.model('Layers', layerSchema);
exports.Map = mongoose.model('Maps', mapSchema);
exports.User = mongoose.model('Users', userSchema);