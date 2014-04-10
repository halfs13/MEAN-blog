/**
 * General functions
 */
var general = {};

general.send200 = function(res, msg){
	res.status(200);
	if (undefined === msg) {
		res.jsonp({status: 'OK'});
	} else {
		res.jsonp(msg);
	}
	res.end();
};

// Created response
general.send201 = function(res, msg){
	res.status(201);
	res.jsonp(msg);
	res.end();
};

// No Content (successful delete)
general.send204 = function(res){
	res.status(204);
	res.end();
};

//General 400 error
general.send400 = function(res, msg){
	res.status(400);
	if (undefined === msg) {
		res.jsonp({error: 'Bad Request'});
	} else {
		res.jsonp(msg);
	}
	res.end();
};

general.send403 = function(res, msg){
	res.status(403);
	if (undefined === msg) {
		res.jsonp({error: 'Private resource'});
	} else {
		res.jsonp(msg);
	}
	res.end();
};

//General 404 error
general.send404 = function(res, msg){
	res.status(404);
	if (undefined === msg) {
		res.jsonp({error: 'Not found'});
	} else {
		res.jsonp(msg);
	}
	res.end();
};

//General 500 error
general.send500 = function(res, msg){
	res.status(500);
	res.jsonp({error:'Server error ' + msg});
	res.end();
};


module.exports = general;