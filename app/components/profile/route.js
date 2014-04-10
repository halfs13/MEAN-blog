var crypto = require('crypto');

module.exports = function(app, services, logger) {
	app.post("/profile/?", function(req, res) {
		//hash key
		var hash = crypto.createHash('sha256');
		hash.update(req.body.password, "utf8");
		var key = hash.digest('base64');

		var data = {
			email: req.body.email,
			key: key
		};

		services.profile.create(data)
		.then(function(profile) {
			logger.debug("Created profile " + profile.id);
			res.json({success: true, id: profile.id});
			res.end();
		}, function(err) {
			logger.error("Error creating profile ", err);
			res.status(500);
			res.json(err);
			res.end();
		});
	});

	app.get("/profile/?", services.profile.verifyAdmin,
		function(req, res) {
			//if admin
			services.profile.find().
			then(function(profiles) {
				res.json(profiles);
				res.end();
			}, function(err) {
				res.json(err);
				res.end();
			});
		}
	);

	app.patch("/profile/:id([0-9a-f]+)", services.profile.verifyAdmin,
		function(req, res) {
			services.profile.update(req.body)
			.then(function(result) {
				res.json(result);
				res.end();
			}, function(err) {
				res.status(500);
				res.json(err);
				res.end();
			});
		}
	);

	app.post("/login/?", function(req, res) {
		if(!req.body.email || !req.body.password) {
			logger.error("Missing username or password");
			res.status(403);
			res.end();
		} else {
			//hash the pass
			var hash = crypto.createHash('sha256');
			hash.update(req.body.password, "utf8");
			var key = hash.digest('base64');

			services.profile.verify(req.body.email, key)
			.then(function(level) {
				logger.debug("Level: " + level);
				if(level) {
					console.log(level);
					req.session.level = level;
					req.session.cookie.expires = false;

					res.json({success: true, level: level});
					res.end();
				} else {
					res.status(403);
					res.end();	
				}
			},function(err) {
				res.status(500);
				res.json({error: err});
				res.end();
			});
		}
	});

	app.get("/logout/?", function(req, res) {
		req.session.destroy();
		res.end();
	});
};