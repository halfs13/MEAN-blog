var Q = require('q');

module.exports = function(models, logger) {
	var me = this;

	//create
	me.create = function(data) {
		var deferred = Q.defer();

		var newProfile = new models.profile(data);
		newProfile.save(function(err) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(newProfile);
			}
		});

		return deferred.promise;
	};

	// me.find = function() {
	// 	return me.findWhere({});
	// }

	// me.findWhere = function(config) {
	// 	var deferred = Q.defer();

	// 	models.profile.findAll({where :config})
	// 	.success(deferred.resolve)
	// 	.error(deferred.reject);

	// 	return deferred.promise;
	// };

	//delete
	//TODO need to handle soft delete
	/*me.delete = function(email) {

	};*/

	me.verifyUser = function(req, res, next) {
		if(req.session && req.session.level) {
			next();
		} else {
			logger.debug("UNAUTHORIZED -- access level [[" +
				(req.session && req.session.level ? req.session.level : "none") + "]]");
			res.status(401);
			res.jsonp({error: 'Invalid authorization level'});
			res.end();
		}
	};

	me.verifyDev = function(req, res, next) {
		if(req.session && req.session.level &&
			(req.session.level === 'dev' || req.session.level === 'admin')) {
			next();
		} else {
			logger.debug("UNAUTHORIZED -- access level [[" +
				(req.session && req.session.level ? req.session.level : "none") + "]]");
			res.status(401);
			res.jsonp({error: 'Invalid authorization level'});
			res.end();
		}
	};

	me.verifyAdmin = function(req, res, next) {
		if(req.session && req.session.level && req.session.level === 'admin') {
			next();
		} else {
			logger.debug("UNAUTHORIZED -- access level [[" +
				(req.session && req.session.level ? req.session.level : "none") + "]]");
			res.status(401);
			res.jsonp({error: 'Invalid authorization level'});
			res.end();
		}
	};

	//verify
	me.verify = function(user, key) {
		var deferred = Q.defer();

		models.profile.findOne({email: user}, function(err, profile) {
			if(err) {
				deferred.reject(err);
			} else if(!profile || profile.key !== key) {
				deferred.resolve(null);
			} else {
				deferred.resolve(profile.level);
			}
		});

		return deferred.promise;
	};

	//check api key
};