/**
 *cbccb170285496f1@module Repositories
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
 *@param {Scbccb170285496f2tring} doctorid
 *@param {String} recordid
 *@param {String} operation
 *@return {Promise} authid
 */

module.exports.authorise = function(doctorid,recordid,operation){
    var def = q.defer();
    
    if(_.isNull(doctorid) || _.isUndefined(doctorid)) {
        def.reject(new exceptions.ArgumentException('Invalid parameter: doctorid')); 
        return def.promise;
    } 
    if(_.isNull(recordid) || _.isUndefined(recordid)) {
        def.reject(new exceptions.ArgumentException('Invalid parameter: recordid')); 
        return def.promise;
    }
    if(_.isNull(operation) || _.isUndefined(operation)) {
        def.reject(new exceptions.ArgumentException('Invalid parameter: operation')); 
        return def.promise;
    }
    var auth_history = {
        doctorId:doctorid,
        recordId:recordid,
        type:operation,
        date:Date.now()
    };
    dataModels.Auth.count({'doctorId':doctorid,'recordId':recordid,'type':operation},function(err,res){
       if (err){
           def.reject(err);
       } else if(res>=1){
           def.resolve(false);
       } else {
    	   dataModels.Auth.findOneAndUpdate({'doctorId':doctorid,'recordId':recordid},auth_history,{upsert:true},function(err,res){
               if(err) {
                    def.reject(err);
               } else if(_.isNull(res)){
                    def.reject(new exceptions.ResourceNotFoundException('Fail To Insert New Authorisation'));
               } else {
                    def.resolve(res._id);
               }
           });
       }
    });
    return def.promise;
}

/**
 *Get Auth Histories
 *@method getAuthHistory
 *@param {String} count
 *@return {Promise} auth history list
 */
module.exports.getAuthHistory = function(count){
    var def = q.defer();
    if(_.isNull(count) || _.isUndefined(count)){
        def.reject(new exceptions.ArgumentException('Invalid Parameter: count'));
        return def.promise;
    }
    var query = dataModels.Auth.find().limit(count).sort({'date':-1});
    query.exec(function(err,res){
        if(err){
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No Auth Histories"));
        } else {
            def.resolve(res);
        }
    });
    return def.promise;
}

/**
 *Get Auth Entity
 *@method getAuthEntity
 *@param {String} recordid 
 *@param {String} type
 *@return {Promise} 
 */
module.exports.getAuthEntity = function(recordid, type){
    var def = q.defer();
    if(_.isNull(recordid) || _.isUndefined(recordid)){
        def.reject(new exceptions.ArgumentException('Invalid Parameter: recordid'));
        return def.promise;
    }
    if(_.isNull(type) || _.isUndefined(type)){
        def.reject(new exceptions.ArgumentException('Invalid Parameter: type'));
        return def.promise;
    }
    var query = dataModels.Auth.find({'recordId':recordid,'type':type},{'_id':0,'doctorId':1,'date':1});
    query.exec(function(err,res){
        if(err){
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No Auth Entity"));
        } else {
            def.resolve(res);
        }
    });
    return def.promise;
}

