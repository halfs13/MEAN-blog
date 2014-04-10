var config = require('../config');

var handler = {};
//This function is used to handle URL paramaters (i.e. /scorecard?count=100)
//This is extensible by just adding the url parameter that you want to implement
//on the given passed request url below.
handler.handleDefaultParams = function (incomingParams) {
	var queryData = (incomingParams ? incomingParams : {});
	var params = {
		count : config.paramDefaults.listCount,
		offset : config.paramDefaults.listOffset,
		sort : config.paramDefaults.listSort,
		sortKey: config.paramDefaults.listSortKey,
		start: config.paramDefaults.listStart,
		end: config.paramDefaults.listEnd,
		date: config.paramDefaults.listDate
	};

	if (queryData.count) {
		params.count = queryData.count;
	}
	if (queryData.offset  && queryData.offset > 0) {
		params.offset = queryData.offset;
	}
	if (queryData.sort) {
		params.sort = ((queryData.sort === 'desc') ? -1 : 1);
	}
	if (queryData.sortKey) {
		params.sortKey = queryData.sortKey;
	}
	if (queryData.start) {
		var dbeg = new Date(queryData.start);
		if (dbeg){
			params.start = dbeg;
		}
	}
	if (queryData.end) {
		var dend = new Date(queryData.end);
		if (dend && dend > params.start){
			params.end = dend;
		}
	}
	if (queryData.date) {
		params.date = queryData.date;
	}

	return params;
};

module.exports = handler;