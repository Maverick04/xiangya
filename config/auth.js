var express = require("express"),
    _ = require('underscore'),
    basicAuth = require('basic-auth'),
    dataAccess = require("../lib/data_access");

module.exports.basicAuth = function(req,res,next){
	//NB! Using basic auth also requires the use of an SSL server before release.
        function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.sendStatus(401);
	};
	var user = basicAuth(req);
        if(!_.has(user,"name") || !_.has(user,"pass")){
            return unauthorized(res);
        }
        dataAccess.user.basicAuthenticate(user.name,user.pass)
        .then(function(success){req.user=success; return next();},function(fail){return unauthorized(res);});
};
