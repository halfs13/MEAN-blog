var config = require('./app/config');

var winston = require('winston');
var logger = new (winston.Logger)({
	transports : [new (winston.transports.Console)({level:config.log_level}),
					new (winston.transports.File)({filename: 'logs/general.log'})]
});

var express = require('express');
var app = express();
var server = require('http').createServer(app);

var fs = require('fs');

var options = {
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./server_cert.pem')
};
var sslServer = require('https').createServer(options, app);

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));

	app.use(express.cookieParser(config.session_pass));
	app.use(express.cookieSession());
	app.use(app.router);
});

server.listen(config.port, function(){
	logger.debug("Express server listening on port " + server.address().port + " in " + app.settings.env + " mode");
});
sslServer.listen(config.sslPort, function(){
	logger.debug("Express SSL server listening on port " + sslServer.address().port + " in " + app.settings.env + " mode");
});

var mongoose = require('mongoose');
var connectString = 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.collection;
mongoose.connect(connectString, function(err) {
	if (err !== undefined) {
		logger.error('Unable to connect to ' + connectString);
		throw err;
		process.exit(1);
	} else {
		logger.warn('Connected to ' + connectString);
		var models;
		var services;
		var routes;
		require('./app/loaders/model_loader.js').loadModels(logger)
		/*.then(function(m) {
			models = m;
			//load services
			return require('./loaders/service_loader.js').loadServices(models, logger);
		}).then(function(s){
			services = s;
			//load rest
			return require('./loaders/rest_loader.js').loadRoutes(app, services, logger);
		}).catch(function(err){
			logger.error(err);
			logger.error("Error while running loaders");
		});*/

		//load workflow
	}
});