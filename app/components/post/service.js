var Bvalidator = require("./bvalidator");
var Validator = require("./validator");
var eventing = require('../../eventing/eventing');
var rss = require('rss');

//FIXME this needs redone with promises
//var Q = require('q');
var async = require('async');

module.exports = function(models, io, logger) {
	var me = this;

	var services = {
		alertService: me
	};

	var bvalidator = new Bvalidator(services, logger);

	/**
	 * Returns a list of all alerts
	 */
	me.list = function(params, callback) {
		//FIXME this needs done in the route
		if (params !== null) {
			var sortObject = {};
			sortObject[params.sortKey] = params.sort;

			var config = {
				createdDate: {
					$gte: params.start,
					$lte: params.end
				}
			};

			models.alert.find(config)
			.skip(params.offset)
			.sort(sortObject)
			.limit(params.count)
			.exec(function(err, res) {
				callback(err, res, config);
			});
		} else {
			models.alert.find({}, function(err, res) {
				callback(err, res, {});
			});
		}
	};

	me.getTags = function(callback) {
		var o = {
			map : function () {
				if (!this.tags) { return; }

				/* global emit */  // TODO: not certain why JSHint cannot see emit
				for (var index in this.tags) {
					if (index >= 0) {
						emit( this.tags[index], 1);
					}
				}
			},

			reduce: function(k, vals) {
				var count = 0;
				for (var index in vals){
					if (index >= 0) {
						count += vals[index];
					}
				}

				return count;
			},
		};

		models.alert.mapReduce(o, callback);
	};

	/**
	 * Returns a list of indexed attributes for alert_
	 */
	me.getIndexes = function(callback) {
		var keys = Object.keys(models.alert.schema.paths);
		var indexes = ["_id"];
		for (var i = 0; i < keys.length; i++) {
			if (models.alert.schema.paths[keys[i]]._index) {
				indexes.push(keys[i].toString());
			}
		}

		callback(indexes);
	};

	/**
	 *	Returns a sorted list containing _id and createdDate for all alert
	 */
	me.findDates = function(callback) {
		models.alert.find({}, {_id: 0, createdDate:1}, function(err, dates) {
			var errorMsg = new Error("Could not get alert Dates: " + err);
			if (err) {
				callback(errorMsg);
			} else {
				async.map(dates, me.flattenArray, function(err, results) {
					if (err) {
						callback(errorMsg);
					} else {
						callback(results);
					}
				});
			}
		});
	};

	/**
	 * Returns the Date version of the parameter string.createdDate
	 */
	me.flattenArray = function(string, callback) {
		callback(null, Date.parse(string.createdDate));
	};

	/**
	 * Returns the number of alerts that fit the specified config
	 */
	me.getTotalCount = function(config, callback) {
		models.alert.count(config, callback);
	};

	/**
	 * Returns only the fields specified in field_string for each alert
	 */
	me.listFields = function(params, field_string, callback) {
		models.alert.find(params, field_string, callback);
	};

	/**
	 * create is a "generic" save method callable from both
	 * request-response methods and parser-type methods for population of alert data
	 *
	 * create calls the validateAlert module to ensure that the
	 * alert data being saved to the database is complete and has integrity.
	 *
	 * saveCallback takes the form function(err, valid object, alert object)
	 */
	me.create = function(data, saveCallback) {
		me.validateAlert(data, function(valid) {
			if (valid.valid) {
				logger.info("Valid Alert");

				var newAlert = new models.alert(data);
				newAlert.save(function(err) {
					if (err) {
						logger.error("Error saving Alert", err);
					} else {
						eventing.fire('alert-saved', newAlert);
					}

					saveCallback(err, valid, newAlert);
				});
			} else {
				saveCallback(undefined, valid, data);
			}
		});
	};

	/**
	 * validateAlert validates a alert object against the Alert
	 * semantic rules and the business rules associated with a alert
	 *
	 * validateAlert calls the JSON validation module revalidator and
	 * calls the business validation module bvalidator for the alert object

	 * data is the alert object being validated
	 *
	 * valCallback takes the form of function(valid structure)
	 */
	me.validateAlert = function(data, valCallback) {
		// is the JSON semantically valid for the alert object?
		Validator.validate(data)
		.then(function(valid) {
			if (valid.valid) {
				// does the Alert object comply with business validation logic
				bvalidator.validate(data, function(valid) {
					valCallback(valid);
				});
			} else {
				valCallback(valid);
			}
		});

	};

	/**
	 *	Returns the alert_ object with the specified id
	 */
	me.get = function(id, callback) {
		me.findWhere({_id: id}, callback);
	};

	/**
	 * generic read method to return all documents that have a matching
	 * set of key, value pairs specified by config
	 *
	 * callback takes the form function(err, docs)
	 */
	me.findWhere = function(config, callback) {
		models.alert.find(config, callback);
	};

	/**
	 * update gets the alert by the specified id then calls validateAlert
	 *
	 * callback takes the form function(err, valid object, alert object)
	 */
	me.update = function(id, data, updCallback) {
		me.get(id, function(err, docs) {
			if (err) {
				logger.error("Error getting alert", err);
				updCallback(err, null, data);
			} else if (docs[0]) {
				docs = docs[0]; //there will only be one alert from the get
				for (var e in data) {
					if (e !== "_id") {
						docs[e] = data[e];
					}
				}

				docs.updatedDate = new Date();
				me.validateAlert(docs, function(valid) {
					if (valid.valid) {
						docs.save(function(err) {
							if (err) {
								updCallback(err, valid, data);
							} else {
								updCallback(err, valid, docs);
							}
						});
					} else {
						updCallback(err, valid, data);
					}
				});
			} else {
				var errorMsg = new Error("Could not find alert to update");
				updCallback(errorMsg, null, data);
			}
		});
	};

	/**
	 * Remove all alerts that match the specified config
	 */
	me.del = function(config, callback) {
		models.alert.remove(config, callback);
	};

	me.getRss = function(callback) {
		me.findWhere({
			activationDate: { $lte: Date.now() },
			$or: [{deactivationDate: {$gte: Date.now()}}, {deactivationDate: undefined}]
		}, function(err, alerts) {
			if(err) {
				logger.error("Error getting alerts for rss feed", err);
			} else {
				var feed = new rss({
					title: "Alerts",
					//feed_url: "localhost", //Is there a way to know what to display for a public url?
					//site_url: "localhost",
					author: "Centurion"
				});
				async.each(alerts, function(alert, innerCallback) {
					feed.item({
						title: alert.name,
						description: alert.severity + " - " + (alert.description ? alert.description : alert.name),
						//url: "FIXME localhost",
						guid: alert._id.toString(),
						date: alert.activationDate
					});
					innerCallback();
				}, function(err) {
					var xml = feed.xml('  ');
					callback(err, xml);
				});
			}
		});
	};
};