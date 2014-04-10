var config = {};

//Port to listen on
config.port = process.env.PORT || 80;
config.sslPort = process.env.PORT || 443;
config.log_level = process.env.LOG_LEVEL || 'debug';
config.session_pass = process.session_pass || 'iamth3wlr$';

config.db = {
	host: 'localhost',
	port: 27017,
	collection: 'mean_blog'
};

module.exports = config;