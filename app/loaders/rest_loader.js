var fs = require('fs');
var Q = require('q');

var restLoader = {};

restLoader.loadRoutes = function(app, services, logger, altPath) {
	var componentPath = altPath || __dirname + "/../components/";
	logger.debug("To read component routes from " + componentPath);

	var routes = {};

	//find all componentPath/**/model.js
	var components = fs.readdirSync(componentPath);
	var routesDir;
	var component;
	for(var i = 0; i < components.length; i++) {
		//logger.debug("To read subdir: " + componentPath + components[i]);
		//modelDir = fs.readdirSync(componentPath + components[i]);
		try {
			logger.debug(componentPath + components[i] + "/route.js");
			component = require(componentPath + components[i] + "/route.js");
			routes[components[i]] = new component(app, services, logger);
		} catch(e) {
			logger.error(e);
			logger.error("Found component folder with no route");
		}
	}
	return routes;
}

module.exports = restLoader