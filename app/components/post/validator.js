var revalidator = require("revalidator");
var Q = require('q');

var validationModel = {
	properties: {
		createdDate: {
			description: 'Date this was created in datastore',
			type: 'object'
		},
		updatedDate: {
			description: 'Date this was last updated in datastore',
			type: 'object'
		},
		name: {
			description: 'Name of the alert',
			type: 'string',
			required: true
		},
		description: {
			description: 'Description of the alert',
			type: 'string'
		}
	}
};

var Validator = {
	validationModel: validationModel,
	validate: function(data) {
		var deferred = Q.defer();

		process.nextTick(function() {
			deferred.resolve(revalidator.validate(data, validationModel));
		});

		return deferred.promise;
	}
};

module.exports = Validator;