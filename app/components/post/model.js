var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var postSchema = new Schema({
	created_by: {type: ObjectId},
	updated_by: {type: ObjectId},
	created_date: {type: Date, "default": Date.now, index: true},
	updated_date: {type: Date, "default": Date.now},
	title: {type: String, required: true},
	subtitle: {type: String},
	tags: {type: [String]},
	text: {type: String},
	image_url: {type: String},
	image_caption: {type: String},
	comments: {type: [ObjectId]}
});

module.exports = mongoose.model('post', postSchema);