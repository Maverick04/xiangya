/**
 *@module Repositories
 *@class AuthRepositories
 */

var _=require('underscore'),
    q=require('q'),
    dataModels = require('../data_models'),
    exceptions = require('../../exceptions');

//Public functions

/**
 *Intert a new record
 *@method authorise
 *@param {String} doctorid
 *@param {String} recordid
 *@param {String} operation
 *@return {Promise} authid
 */

module.exports.authorise = function(doctorid,recordid,operation){
    var def = q.defer();
    
    if(_.isNull(doctorid) || _.isUndefined(doctorid)) {
        def.reject(exceptions.ArgumentException('Invalid parameter: doctorid')); 
        return def.promise;
    } 
    if(_.isNull(recordid) || _.isUndefined(recordid)) {
        def.reject(exceptions.ArgumentException('Invalid parameter: recordid')); 
        return def.promise;
    }
    if(_.isNull(operation) || _.isUndefined(operation)) {
        def.reject(exceptions.ArgumentException('Invalid parameter: operation')); 
        return def.promise;
    }
    var auth_history = new dataModels.Auth({
        doctorId:doctorid,
        recordId:recordid,
        type:operation
    });
    auth_history.save(function(err,res){
        if(err) {
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException('Fail To Insert New Authorisation'));
        } else {
            def.resolve(res._id);
        }
    });
    return def.promise;
}
