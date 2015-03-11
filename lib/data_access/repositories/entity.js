/**
 *@module Repositories
 *@class EntityRepositories
 */

var _=require('underscore'),
    q=require('q'),
    dataModels = require('../data_models'),
    exceptions = require('../../exceptions');

//Public functions

/**
 *Get the detail about one entity
 *@method getById 
 *@param {String} entityid 
 *@return {Promise} entity object
 */

module.exports.getById = function(entityid){
    var def = q.defer();
    if(_.isNull(entityid) || _.isUndefined(entityid)){
         def.reject(new exceptions.ArgumentException('Invalid Parameter: entityid'));
         return def.promise;
    }
    
    dataModels.Entity.findById(entityid,{'__v':0},function(err,res){
        if(err){
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException('No entity with id: ' + entityid));
        } else {
            def.resolve(res);
        }
    });
    return def.promise;
}


/**
 *remove one entity
 *@method removeById
 *@param {String} entityid
 *@return {Promise} delete status
 */
module.exports.removeById = function(entityid){
    var def = q.defer();
    if(_.isNull(entityid) || _.isUndefined(entityid)){
         def.reject(new exceptions.ArgumentException('Invalid Parameter: entityid'));
         return def.promise;
    }
    
    dataModels.Entity.findByIdAndRemove(entityid,function(err,res){
        if(err){
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException('No entity with id: ' + entityid));
        } else {
            def.resolve(true);
        }
    });
    return def.promise;
}


/**
 *insert one entity
 *@method insert
 *@param {String} type
 *@param {String} images
 *@return {Promise} entityid
 */
module.exports.insert = function(type,images){
    var def = q.defer();
    if(_.isNull(type) || _.isUndefined(type) || !_.isString(type)){
         def.reject(new exceptions.ArgumentException('Invalid Parameter: type'));
         return def.promise;
    }
    if(_.isNull(images) || _.isUndefined(images) || !_.isArray(images) || _.isEmpty(images)){
         def.reject(new exceptions.ArgumentException('Invalid Parameter: images'));
         return def.promise;
    }
    
    var entity = new dataModels.Entity({type:type,images:images});
    entity.save(function(err,res){
        if(err){
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException('Fail To Insert New Entity'));
        } else {
            def.resolve(res._id);
        }
    });
    return def.promise;
}


/**
 *add one image
 *@method addImage
 *@param {String} entityid
 *@param {String} image
 *@return {Promise} operation status
 */
module.exports.addImage = function(entityid,image){
    var def = q.defer();
    if(_.isNull(entityid) || _.isUndefined(entityid)){
         def.reject(new exceptions.ArgumentException('Invalid Parameter: entityid'));
         return def.promise;
    }
    if(_.isNull(image) || _.isUndefined(image)){
         def.reject(new exceptions.ArgumentException('Invalid Parameter: image'));
         return def.promise;
    }
    dataModels.Entity.findByIdAndUpdate(entityid,{$addToSet:{images:image}},function(err,res){
        if(err){
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException('Fail To Add An Image'));
        } else {
            def.resolve(true);
        }
    });
    return def.promise;
}


/**
 *remove one image
 *@method removeImage
 *@param {String} entityid
 *@param {String} image
 *@return {Promise} operation status
 */
module.exports.removeImage = function(entityid,image){
    var def = q.defer();
    if(_.isNull(entityid) || _.isUndefined(entityid)){
         def.reject(new exceptions.ArgumentException('Invalid Parameter: entityid'));
         return def.promise;
    }
    if(_.isNull(image) || _.isUndefined(image)){
         def.reject(new exceptions.ArgumentException('Invalid Parameter: image'));
         return def.promise;
    }
    dataModels.Entity.findByIdAndUpdate(entityid,{$pull:{images:image}},function(err,res){
        if(err){
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException('Fail To Remove An Image'));
        } else {
            def.resolve(true);
        }
    });
    return def.promise;
}
