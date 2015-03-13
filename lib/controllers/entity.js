/**
 *@module Controllers
 *@class EntityController
 */

var _ = require('underscore'),
    dataAccess = require('../data_access'),
    util = require('../util'),
    exceptions = require('../exceptions');

/**
  *POST /entity/create
  *create a new entity
  *@method createEntity
  */
module.exports.createEntity = function(req,res){
    if(_.has(req.body,'type') && _.has(req.body,'images')){
        dataAccess.entity.insert(req.body.type,req.body.images.split(','))
        .then(function(result){
            res.json(result);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res,new exceptions.ArgumentException("Missing Parameter"));
    }
}


/**
  *GET /entity/:entityid
  *return details of a entity
  *@method getById
  */
module.exports.getById = function(req,res){
    if(_.has(req.params,'entityid')){
        dataAccess.entity.getById(req.params.entityid)
        .then(function(result){
            res.json(result);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res,new exceptions.ArgumentException("Missing Parameter"));
    }
}


/**
  *POST /entity/addImage
  *add a new image to entity
  *@method addImage
  */
module.exports.addImage = function(req,res){
    if(_.has(req.body,'entityid') && _.has(req.body,'image')){
        dataAccess.entity.addImage(req.body.entityid,req.body.image)
        .then(function(result){
            res.json(result);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res,new exceptions.ArgumentException("Missing Parameter"));
    }
}


/**
  *POST /entity/removeImage
  *remove a image from entity
  *@method removeImage
  */
module.exports.removeImage = function(req,res){
    if(_.has(req.body,'entityid') && _.has(req.body,'image')){
        dataAccess.entity.removeImage(req.body.entityid,req.body.image)
        .then(function(result){
            res.json(result);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res,new exceptions.ArgumentException("Missing Parameter"));
    }
}



/**
  *POST /entity/remove
  *remove a  entity
  *@method remove
  */
module.exports.remove = function(req,res){
    if(_.has(req.body,'entityid')){
        dataAccess.entity.removeById(req.body.entityid)
        .then(function(result){
            res.json(result);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res,new exceptions.ArgumentException("Missing Parameter"));
    }
}

