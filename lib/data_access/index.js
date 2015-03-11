/**
 * Module providing database access and manipulation
 * 
 *@module DataAccess
 *@class DataAccess
 */

//Module dependencies
var _ = require('underscore'),
    util = require('util'),
    q = require('q'),
    async = require('async'),
    mongoose = require('mongoose'),
    exceptions = require('../exceptions'),
    dataModels = require('./data_models');

var mongo = require("../../config/environment")(process.env.NODE_ENV);

var conn;

//Connect to database
if (process.env.NODE_ENV === 'production') {
	var cstring = mongo.connstring || "";
	conn = mongoose.connect(cstring);

} else {
	var hostname = process.env.MONGO_HOST || mongo.hostname || 'localhost',
	    port = process.env.MONGO_PORT || mongo.port || 27017,
	    dbname = process.env.MONGO_DB_NAME || mongo.name || 'xiangya-dev';
	var connstring = util.format('mongodb://%s:%s/%s',hostname,port,dbname);
	conn = mongoose.connect(connstring);
}

//Export all the objects
module.exports.user = require('./repositories/user');
module.exports.doctor = require('./repositories/doctor');
module.exports.patient = require('./repositories/patient');
module.exports.record = require('./repositories/record');
module.exports.department = require('./repositories/department');
module.exports.auth = require('./repositories/auth_history');
module.exports.entity = require('./repositories/entity');

/**
 *Delete all database objects with a given model
 *method reset
 *@param{Objectt} dataModel Model to be deleted
 */
module.exports.reset = function(dataModel){
	var def =q.defer();
	if(_.isNull(dataModel) || _.isUndefined(dataModel)){
		def.reject(new exceptions.ArgumentException("Invalid parameter: dataModel"));
		return def.promise;
	}
	dataModel.remove({},function(err){
		if(err){
			def.reject(err);
		} else {
			def.resolve(true);
		}
	});
	return def.promise;
}

/**
 *Seed database with provided data for a model
 *method seed
 *param {Object} dataModel Model to be seeded
 *param {List} entities List of entities to be inserted
 */
module.exports.seed = function(dataModel, entities){
    var def = q.defer();
    if (_.isUndefined(dataModel) || _.isNull(dataModel)) {
       def.reject(new ArgumentException('Invalid parameter: dataModel'));
       return def.promise;
    }
    if (_.isUndefined(entities) || _.isNull(entities)) {
       def.reject(new ArgumentException('Invlid parameter: entities'));
       return def.promise;
    }
   
    var calls = [];

    entities.forEach(function(entity){
        calls.push(function (callback) {
       	    new dataModel(entity).save(function(err){
		if(err){
		    return callback(err);
                } else {
		    return callback();
                }
            });  
        });
    });
    
    async.parallel(calls,function(err){
        if(err){
            def.reject(err);
        } else{
            def.resolve(true);
        }
    });
   return def.promise;
}

