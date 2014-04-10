//FIXME This file contains code from https://github.com/NextCenturyCorporation/everest licensed under MIT
//This code is being used as reference and is not intended for use

module.exports = function(app, services, io, logger) {
	app.get("/rest/post/?", function(req, res) {
		logger.debug("Request for a list of all posts");

		services.post.list(req.query)
		.then(function(docs, config) {
			if (err) {
				logger.error("Alert: " + err, err);
				services.response_handler.send500(res, "Error getting posts");
			} else {
				res.jsonp({docs: docs, total_count: count});
				res.end();
			});
		})
		.catch(function(err) {
			logger.error("Error listing posts", err);
			services.response_handler.send500(res, "Error listing posts " + err);
		});
	});

	/**
	 * List createdDate for all of the posts (in milliseconds)
	 */
	app.get("/rest/post/dates/?", function(req,res) {
		logger.debug("Request for list of dates of posts");

		services.post.findDates(function(dates) {
			if (!dates) {
				services.response_handler.send500(res, "Error getting dates for posts");
			} else {
				res.jsonp(dates);
				res.end();
			}
		});
	});

	app.post("/rest/post/?", function(req, res) {
		logger.debug("Receiving new post ", req.body);
		//FIXME need to check logged in and admin


		// MIT licensed Next Century EVEREST code
		// services.alert.create(req.body, function(err, val, newAlert) {
		// 	if (err) {
		// 		logger.error("Error saving Alert", err);
		// 		services.response_handler.send500(res, "Error saving Alert " + err);
		// 	} else if (!val.valid) {
		// 		logger.info("Invalid Alert " + JSON.stringify(val.errors));
		// 		services.response_handler.send400(res, {error: "Invalid Alert " + JSON.stringify(val.errors) } );
		// 	} else {
		// 		logger.info("Alert saved " + JSON.stringify(newAlert));
		// 		services.response_handler.send200(res, {_id: newAlert._id} );
		// 	}
		// });
	});

	// MIT licensed Next Century EVEREST code
	// app.get("/alert/:id([0-9a-f]+)", function(req, res) {
	// 	logger.debug("Request for Alert " + req.params.id);

	// 	services.alert.get(req.params.id, function(err, docs){
	// 		if (err) {
	// 			logger.error("Error getting Alert ", err);
	// 			services.response_handler.send500(res, "Error getting Alert");
	// 		} else if (docs[0]) {
	// 			res.jsonp(docs[0]);
	// 			res.end();
	// 		} else {
	// 			services.response_handler.send404(res);
	// 		}
	// 	});
	// });

	// app.put("/alert/:id([0-9a-f]+)", function(req, res) {
	// 	logger.debug("Update Alert " + req.params.id);

	// 	services.alert.update(req.params.id, req.body, function(err, val, updated) {
	// 		if (err) {
	// 			logger.error("Error updating Alert", err);
	// 			services.response_handler.send500(res, "Error updating Alert " + err);
	// 		} else if (!val.valid) {
	// 			logger.info("Invalid Alert " + JSON.stringify(val.errors));
	// 			services.response_handler.send400(res, {error: "Invalid Alert " + JSON.stringify(val.errors) } );
	// 		} else {
	// 			logger.info("Alert updated " + JSON.stringify(updated));
	// 			services.response_handler.send200(res, {_id: updated._id} );
	// 		}
	// 	});
	// });

	app.del("/rest/post/:id([0-9a-f]+)", function(req, res) {
		logger.debug("Deleting post with id: " + req.params.id);

		services.post.del({_id: req.params.id})
		.then(services.response_handler.send204)
		.catch(function(err) {
			logger.error("Error deleting post " + req.params.id, err);
			services.response_handler.send404(res, {error: "Post " + req.params.id + " was not deleted."});
		});
	});

	app.del("/rest/post/?", function(req, res) {
		logger.debug("Deleting all posts");

		services.post.del({})
		.then(services.response_handler.send204)
		.catch(function(err) {
			logger.error("Error deleting all posts ", err);
			services.response_handler.send404(res, {error: "Posts were not deleted."});
		});
	});

	app.get("/rest/post/rss/?", function(req, res) {
		logger.debug("Generating RSS");

		services.post.getRss(function(err, xml) {
			res.header('Content-Type','text/xml').send(xml);
		});
	});
};