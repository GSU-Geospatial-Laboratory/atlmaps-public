var mongoose = require("mongoose");

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var WmsLayer = new Schema({
	name : {
		type : String
	},
	keywords : {
		type : String
	},
	url : {
		type : String
	}
})

module.exports = WmsLayer