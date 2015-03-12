/**
 *@module Authentication
 *@class basicAuthentication
 */

var express = require("express"),
    _ = require('underscore'),
    basicAuth = require('basic-auth'),
    dataAccess = require("../lib/data_access");

/**
 *Authenticate Users, Will Append user To request if succeed
 *@method basicAuth
 *@param {Object} req
 *@param {Object} res
 *@param {Object} next
 */
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

/**
 *Authenticate Doctor, Will Append user To request if succeed
 *@method basicAuthDoctor
 *@param {Object} req
 *@param {Object} res
 *@param {Object} next
 */
module.exports.basicAuthDoctor = function(req,res,next){
	//NB! Using basic auth also requires the use of an SSL server before release.
        function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.sendStatus(401);
	};
	var user = basicAuth(req);
        if(!_.has(user,"name") || !_.has(user,"pass")){
            return unauthorized(res);
        }
        dataAccess.doctor.basicAuthenticate(user.name,user.pass)
        .then(function(success){req.doctor=success; return next();},function(fail){return unauthorized(res);});
};
