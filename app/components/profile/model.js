var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var profileSchema = new Schema({
	createdDate: {type: Date, "default": Date.now, index: true},
	updatedDate: {type: Date, "default": Date.now},
	email: {type: String, unique: true, required: true},
	key: {type: String, required: true, select: false},
	level: {type: String, enum: ["dev", "admin", "user"], default: "user"},
	api_access_rights: {type: Boolean, "default": false},
	api_key: {type: String}
});
var profile = mongoose.model('profile', profileSchema);

module.exports = profile;