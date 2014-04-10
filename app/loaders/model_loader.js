var fs = require('fs');

var modelLoader = {};

modelLoader.loadModels = function(logger, altPath) {
	var componentPath = altPath || __dirname + "/../components/";
	logger.debug("To read component models from " + componentPath);

	var models = {};

	//find all componentPath/**/model.js
	var components = fs.readdirSync(componentPath);
	var modelDir;
	for(var i = 0; i < components.length; i++) {
		try {
			logger.debug(componentPath + components[i] + "/model.js");
			models[components[i]] = require(componentPath + components[i] + "/model.js");
		} catch(e) {
			logger.error(e);
			logger.error("Found component folder with no model");
		}
	}
	return models;
}

module.exports = modelLoader;