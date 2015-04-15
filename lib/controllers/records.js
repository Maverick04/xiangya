/**
 *@module Controllers
 *@class RecordController
 */

var _ = require('underscore'),
    dataAccess = require('../data_access'),
    util = require('../util'),
    exceptions = require('../exceptions');


/**
 *POST /record/create
 *@method createRecord
 *@param {String} patientid
 *@param {String} departmentid
 *@param {String} hospitalName
 *@param {String} keyword
 *@param {String} details
 */

module.exports.createRecord = function(req,res){
    if(_.has(req.body,'patientid') && _.has(req.body,'departmentid') && _.has(req.body,'hospitalName') && _.has(req.body,'keyword') && _.has(req.body,'details')){
        dataAccess.record.insertRecord(req.body.patientid,req.body.departmentid,req.body.hospitalName,req.body.keyword,req.body.details.split(','))
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}

/**
 *GET /record/:recordid
 *@method getById
 *@param {String} recordid
 */
module.exports.getById = function(req,res){
    if(_.has(req.params,'recordid')){
        dataAccess.record.getById(req.params.recordid)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}

/**
 *POST /record/keyword
 *@method updateKeyword
 *@param {String} recordid
 *@param {String} keyword
 */
module.exports.updateKeyword = function(req,res){
    if(_.has(req.body,'recordid') && _.has(req.body,'keyword')){
        dataAccess.record.updateKeyword(req.body.recordid,req.body.keyword)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}

/**
 *POST /record/addentity
 *@method addEntity
 *@param {String} recordid
 *@param {String} entityid
 */
module.exports.addEntity = function(req,res){
    if(_.has(req.body,'recordid') && _.has(req.body,'entityid')){
        dataAccess.record.addEntity(req.body.recordid,req.body.entityid)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}

/**
 *POST /record/delentity
 *@method removeEntity
 *@param {String} recordid
 *@param {String} entityid
 */
module.exports.removeEntity = function(req,res){
    if(_.has(req.body,'recordid') && _.has(req.body,'entityid')){
        dataAccess.record.removeEntity(req.body.recordid,req.body.entityid)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}


/**
 *GET /record/keyword
 *@method getByKeywords
 *@param {String} keyword
 */
module.exports.getByKeywords = function(req,res){
 if(_.has(req.params,'keyword')){
        dataAccess.record.getByKeywords(req.params.keyword)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}


/**
 *GET /recorddoc
 *@method getByDoctor
 */
module.exports.getByDoctor = function(req,res){
 if(_.has(req.doctor,'_id')){
        dataAccess.record.getByDoctor(req.doctor._id)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}


/**
 *GET /recordpat/:patientid
 *@method getByPatient
 *@param {String} patientid
 */
module.exports.getByPatient = function(req,res){
 if(_.has(req.params,'patientid')){
        dataAccess.record.getByPatient(req.params.patientid)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}


/**
 *GET /recorduser/:userid
 *@method getByUser
 *@param {String} userid
 */
module.exports.getByUser = function(req,res){
 if(_.has(req.user,'_id')){
        dataAccess.record.getByUser(req.user._id)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}

/**
 *GET /recordauth/:recordid
 *@method getByAuth
 *@param {String} recordid
 */
module.exports.getByAuth = function(req,res){
 if(_.has(req.doctor,'_id') && _.has(req.params,'recordid')){
        dataAccess.record.getByAuth(req.doctor._id,req.params.recordid)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}


/**
 *GET /patients/:keyword
 *@method getPatients
 *@param {String} keyword
 */
module.exports.getPatients = function(req,res){
 if(_.has(req.params,'keyword')){
        dataAccess.patient.getByKeyword(req.params.keyword)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}

/**
 *GET /recorddel/:recordid
 *@method removeRecord 
 *@param {String} keyword
 */
module.exports.remove = function(req,res){
 if(_.has(req.params,'recordid')){
        dataAccess.record.removeById(req.params.recordid)
        .then(function(record){
            res.json(record);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}


/**
 *POST /recordauth
 *@method recordauth
 *@param {String} doctorid
 *@param {String} recordid
 *@param {String} operatrion
 */
module.exports.recordauth = function(req,res){
 if(_.has(req.body,'recordid') && _.has(req.body, 'doctorid') && _.has(req.body, 'operation')){
        dataAccess.auth.authorise(req.body.doctorid,req.body.recordid,req.body.operation)
        .then(function(history){
            res.json(history);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.ArgumentException("Missing Parameter"));
    }
}

/**
 *POST /authentity
 *@method getAuthEntity
 *@param {String} recordid
 *@param {String} type
 */
module.exports.getAuthEntity = function(req,res){
 if(_.has(req.body,'recordid') && _.has(req.body,'type')){
        dataAccess.auth.getAuthEntity(req.body.recordid,req.body.type)
        //dataAccess.auth.getAuthHistory(2)
        .then(function(entity){
            res.json(entity);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.Acbccb170285496f1rgumentException("Missing Parameter"));
    }
}

/**
 *GET /authhistory
 *@method getAuthHistory
 *@param {String} count
 */
module.exports.getAuthHistory = function(req,res){
 if(_.has(req.params,'count')){
        dataAccess.auth.getAuthHistory(req.params.count)
        .then(function(entity){
            res.json(entity);
        })
        .fail(function(err){
            exceptions.errorResponse(res,err);
        })
        .done();
    } else {
        exceptions.errorResponse(res, new exceptions.Acbccb170285496f1rgumentException("Missing Parameter"));
    }
}
