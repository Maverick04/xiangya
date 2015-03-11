var ResourceNotFoundException = require('./ResourceNotFoundException'),
    ForbiddenOperationException = require('./ForbiddenOperationException'),
    ArgumentException = require('./ArgumentException'),
    _ = require("underscore");

module.exports.ResourceNotFoundException = ResourceNotFoundException;
module.exports.ForbiddenOperationException = ForbiddenOperationException;
module.exports.ArgumentException = ArgumentException;

module.exports.errorResponse = function (res, err) {
    if (!_.isUndefined(err.message)) {
        console.log(err.message);
    }
    if (!_.isUndefined(err.stack)) {
    	console.log(err.stack);
    }

    if (err instanceof ResourceNotFoundException) {
	return res.status(404).send(err.message);
    } else if (err instanceof ArgumentException) {
	return res.status(400).send(err.message);
    } else if (err instanceof ForbiddenOperationException) {
	return res.status(403).send(err.message);
    } else {
	return res.status(500);
    }
    res.end();
};
