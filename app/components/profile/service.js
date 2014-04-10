var Q = require('q');

module.exports = function(models, logger) {
	var me = this;

	//create
	me.create = function(data) {
		var deferred = Q.defer();

		var newProfile = models.profile.build(data);
		newProfile.save()
		.success(function(param1, param2) {
			logger.debug(param1);
			logger.debug(param2);
			deferred.resolve(newProfile);
		})
		.error(deferred.reject);

		return deferred.promise;
	};

	me.find = function() {
		return me.findWhere({});
	}

	me.findWhere = function(config) {
		var deferred = Q.defer();

		models.profile.findAll({where :config})
		.success(deferred.resolve)
		.error(deferred.reject);

		return deferred.promise;
	};

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

		models.profile.find({where: {email: user}}).
		success(function(profile) {
			if(!profile || profile.key !== key) {
				deferred.resolve(null);
			} else {
				deferred.resolve(profile.level);
			}
		}).error(deferred.reject);

		return deferred.promise;
	};

	//check api key
};