var fs = require('fs');
var Q = require('q');

var serviceLoader = {};

serviceLoader.loadServices = function(models, logger, altPath) {
	var componentPath = altPath || __dirname + "/../components/";
	logger.debug("To read component services from " + componentPath);

	var services = {};

	//find all componentPath/**/model.js
	var components = fs.readdirSync(componentPath);
	var serviceDir;
	var component;
	for(var i = 0; i < components.length; i++) {
		//logger.debug("To read subdir: " + componentPath + components[i]);
		//modelDir = fs.readdirSync(componentPath + components[i]);
		try {
			logger.debug(componentPath + components[i] + "/service.js");
			component = require(componentPath + components[i] + "/service.js");
			services[components[i]] = new component(models, logger);
		} catch(e) {
			logger.error(e);
			logger.error("Found component folder with no service");
		}
	}
	return services;
};

module.exports = serviceLoader;