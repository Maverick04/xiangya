module.exports = function (env) {
	if (env === 'production') {
		console.log("using production connstring to mongo");
		return {
			"connstring": "",
			"host": "",
			"port": 27017,
			"replset": ""
		};
	} else {
		console.log("using localhost as mongo connection");
		return {
			"host": "localhost",
			"port": 27017,
			"replset": ""
		};
	}
};
