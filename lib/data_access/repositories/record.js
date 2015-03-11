/**
 *@module Repositories
 *@class RecordRepositories
 */

var _=require('underscore'),
    q=require('q'),
    dataModels = require('../data_models'),
    exceptions = require('../../exceptions');

//Public functions

/**
 *Intert a new record
 *@method insertRecord
 *@param {Object} record
 *@return {Promise} recordId
 */
module.exports.insertRecord = function(patientid,departmentid,hospitalName,details){
    var def = q.defer();
    
    if(_.isNull(patientid) || _.isUndefined(patientid)) {
        def.reject(new exceptions.ArgumentException('Invalid parameter: patientid')); 
        return def.promise;
    } 
    if(_.isNull(departmentid) || _.isUndefined(departmentid)) {
        def.reject(new exceptions.ArgumentException('Invalid parameter: departmentid')); 
        return def.promise;
    } 
    if(_.isNull(hospitalName) || _.isUndefined(hospitalName)) {
        def.reject(new exceptions.ArgumentException('Invalid parameter: hospitalName')); 
        return def.promise;
    } 
    if(_.isNull(details) || _.isUndefined(details) || !_.isArray(details)) {
        def.reject(new exceptions.ArgumentException('Invalid parameter: details')); 
        return def.promise;
    } 

    var record = new dataModels.Record({patientId:patientid,departmentId:departmentid,hospitalName:hospitalName,details:details});

    record.save(function(err,res){
        if(err){
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException('Fail To Insert New Record'));
        } else {
            def.resolve(res._id);
        }
    });
    return def.promise;
}

/**
 *Get record detail by Id
 *@method getById
 *@param {String} recordid
 *@return {Promise} record object
 */
module.exports.getById = function(recordid){
   var def = q.defer(); 
   
   if(_.isNull(recordid) || _.isUndefined(recordid)){
       def.reject(new exceptions.ArgumentException('Invalid parameter: recordid'));
       return def.promise;
   }
   
   dataModels.Record.findById(recordid,{'__v':0},function(err,res){
      if(err){
          def.reject(err);
      } else if(_.isNull(res)){
          def.reject(new exceptions.ResourceNotFoundException('No Record With Id: ' + recordid));
      } else {
          dataModels.Entity.find({'_id':{$in:res.details}},{'__v':0},function(err,detail){
              if(err){
                  def.reject(err);
              } else if(_.isNull(detail)){
                  def.reject(new exceptions.ResourceNotFoundException('No Details For This Record'));
              } else {
                  res = res.toObject();
                  res.details = detail;
                  def.resolve(res);
              }
          });
      }
   });
   return def.promise;
}


/**
 *Remove record
 *@method removeById
 *@param {String} recordid
 *@return {Promise} operation status
 */
module.exports.removeById = function(recordid){
   var def = q.defer(); 
   
   if(_.isNull(recordid) || _.isUndefined(recordid)){
       def.reject(new exceptions.ArgumentException('Invalid parameter: recordid'));
       return def.promise;
   }
   dataModels.Record.findByIdAndRemove(recordid,function(err,res){
      if(err){
          def.reject(err);
      } else if(_.isNull(res)){
          def.reject(new exceptions.ResourceNotFoundException('No Record With Id: ' + recordid));
      } else {
          def.resolve(true);
      }
   });
   return def.promise;
}


/**
 *Search record
 *@method getByKeywords
 *@param {String} keyword
 *@return {Promise} record digest list
 */
module.exports.getByKeywords = function(keyword){
   var def = q.defer(); 
   
   if(_.isNull(keyword) || _.isUndefined(keyword)){
       def.reject(exceptions.ArgumentException('Invalid parameter: keyword'));
       return def.promise;
   }

}


/**
 *List all records of a doctor
 *@method getByDoctorId
 *@param {String} doctorid
 *@return {Promise} record digest list
 */
module.exports.getByDoctorId = function(doctorid){
   var def = q.defer(); 
   
   if(_.isNull(doctorid) || _.isUndefined(doctorid)){
       def.reject(exceptions.ArgumentException('Invalid parameter: doctorid'));
       return def.promise;
   }
}


/**
 *List all records of a patients to a doctor
 *@method getByPatientAndDoctor
 *@param {String} doctorid
 *@param {String} patiendid
 *@return {Promise} record digest list
 */
module.exports.getByPatientAndDoctor = function(patientid,doctorid){
   var def = q.defer(); 
   
   if(_.isNull(doctorid) || _.isUndefined(doctorid)){
       def.reject(exceptions.ArgumentException('Invalid parameter: doctorid'));
       return def.promise;
   }
   if(_.isNull(patientid) || _.isUndefined(patientid)){
       def.reject(exceptions.ArgumentException('Invalid parameter: patientid'));
       return def.promise;
   }
}
