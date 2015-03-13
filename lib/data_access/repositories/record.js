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
module.exports.insertRecord = function(patientid,departmentid,hospitalName,keyword,details){
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
    if(_.isNull(keyword) || _.isUndefined(keyword)) {
        def.reject(new exceptions.ArgumentException('Invalid parameter: keyword')); 
        return def.promise;
    } 
    if(_.isNull(details) || _.isUndefined(details) || !_.isArray(details)) {
        def.reject(new exceptions.ArgumentException('Invalid parameter: details')); 
        return def.promise;
    } 

    var record = new dataModels.Record({patientId:patientid,departmentId:departmentid,hospitalName:hospitalName,keyword:keyword,details:details});

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
   var def = q.defer(); 4
   
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
 *Update the keyword of a record
 *@method updateKeyword
 *@param {String} recordid
 *@param {String} keyword
 *@return {Promise} update status
 */
module.exports.updateKeyword  = function(recordid,keyword){
    var def = q.defer();
   
    if(_.isNull(recordid) || _.isUndefined(recordid)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: recordid'));
        return def.promise;
    }
    if(_.isNull(keyword) || _.isUndefined(keyword)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: keyword'));
        return def.promise;
    }
    dataModels.Record.findByIdAndUpdate(recordid,{'keyword':keyword},function(err,res){
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
 *Add one entity for the record
 *@method addEntity
 *@param {String} recordid
 *@param {String} entityid
 *@return {Promise} status
 */
module.exports.addEntity  = function(recordid,entityid){
    var def = q.defer();
   
    if(_.isNull(recordid) || _.isUndefined(recordid)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: recordid'));
        return def.promise;
    }
    if(_.isNull(entityid) || _.isUndefined(entityid)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: entity'));
        return def.promise;
    }
    dataModels.Record.findByIdAndUpdate(recordid,{$addToSet:{details:entityid}},function(err,res){
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
 *Remove one entity for the record
 *@method removeEntity
 *@param {String} recordid
 *@param {String} entityid
 *@return {Promise} status
 */
module.exports.removeEntity  = function(recordid,entityid){
    var def = q.defer();
   
    if(_.isNull(recordid) || _.isUndefined(recordid)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: recordid'));
        return def.promise;
    }
    if(_.isNull(entityid) || _.isUndefined(entityid)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: entity'));
        return def.promise;
    }
    dataModels.Record.findByIdAndUpdate(recordid,{$pull:{details:entityid}},function(err,res){
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
   
   dataModels.Record.find({'keyword':keyword},{'_id':1,'departmentId':1,'keyword':1,'createDate':1},function(err,res){
       if(err){
           def.reject(err);
       } else if(_.isNull(res) || _.isEmpty(res)){
           def.reject(new exceptions.ResourceNotFoundException("No Record With Keyword: " + keyword));
       } else {
           def.resolve(res);
       }
   });
   return def.promise; 
}


/**
 *List all records of a doctor
 *@method getByDoctorId
 *@param {String} doctorid
 *@return {Promise} record digest list(authenticated)
 */
module.exports.getByDoctor = function(doctorid){
   var def = q.defer(); 
   
   if(_.isNull(doctorid) || _.isUndefined(doctorid)){
       def.reject(exceptions.ArgumentException('Invalid parameter: doctorid'));
       return def.promise;
   }
   dataModels.Auth.find({'doctorId':doctorid,'type':'true'},{'_id':0,'recordId':1},function(err,res){
       if(err){
           def.reject(err);
       } else if(_.isNull(res) || _.isEmpty(res)){
           def.reject(new exceptions.ResourceNotFoundException("No Available Records"));
       } else {
           var resId=[];
           _.each(res,function(id){resId.push(id.recordId);});
           dataModels.Record.find({'_id':{$in:resId}},{'_id':1,'departmentId':1,'keyword':1,'createDate':1},function(err,records){
               if(err){
                   def.reject(err);
               } else if (_.isNull(records)){
                   def.reject(new exceptions.ResourceNotFoundException('No Available Records'));
               } else {
                   def.resolve(records);
               }
           });
       }
     });
    return def.promise; 
}


/**
 *List all records of a patients
 *@method getByPatient
 *@param {String} patiendid
 *@return {Promise} record digest list(authenticated)
 */
module.exports.getByPatient = function(patientid){
   var def = q.defer(); 
    
   if(_.isNull(patientid) || _.isUndefined(patientid)){
       def.reject(exceptions.ArgumentException('Invalid parameter: patientid'));
       return def.promise;
   }

   dataModels.Record.find({'patientId':patientid},{'_id':1,'departmentId':1,'keyword':1,'createDate':1},function(err,res){
      if(err){
          def.reject(err);
      } else if(_.isNull(res)){
          def.reject(new exceptions.ResourceNotFoundException('No Record With Id: ' + recordid));
      } else {
          def.resolve(res);
      }
   });
   return def.promise;
}


/**
 *return the record detail if authenticated
 *@method getByAuth
 *@param {String} doctorid
 *@param {String} recordid
 *@return {Promise} record digest list(authenticated)
 */
module.exports.getByAuth = function(doctorid, recordid){
   var def = q.defer(); 
   if(_.isNull(doctorid) || _.isUndefined(doctorid)){
       def.reject(exceptions.ArgumentException('Invalid parameter: doctorid'));
       return def.promise;
   }
   if(_.isNull(recordid) || _.isUndefined(recordid)){
       def.reject(exceptions.ArgumentException('Invalid parameter: recordid'));
       return def.promise;
   }

   dataModels.Auth.count({'doctorId':doctorid,'recordId':recordid,'type':true},function(err,count){
       if(err){
           def.reject(err);
       } else if (count == 0){
           def.reject(new exceptions.ResourceNotFoundException("No Authenticated"));
       } else {
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
       }
   });
 
   return def.promise;
}
