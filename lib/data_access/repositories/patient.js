/**
 *@module Repositories
 *@class PatientRepositories
 */

var _ = require('underscore'),
    q = require('q'),
    dataModels = require('../data_models'),
    exceptions = require('../../exceptions');

//Public functions

/**
 rBind patient with user
 *@method bindPatient
 *@param {String} userid
 *@param {String} name
 *@param {String} identity
 *@param {String} card
 *@param {String} sex
 *@param {ISODate} birthday
 *@param {String} job
 *@return {Promise} patientId
 */

module.exports.bindPatient = function(userid,name,identity,card,sex,birthday,job){
    var def = q.defer();
    
    if (_.isNull(userid) || _.isUndefined(userid)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: userid"));
        return def.promise;
    }
    if (_.isNull(name) || _.isUndefined(name)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: name"));
        return def.promise;
    }
    if (_.isNull(identity) || _.isUndefined(identity) || identity.length !== 18){
        def.reject(new exceptions.ArgumentException("Invalid parameter: identity"));
        return def.promise;
    }
    if (_.isNull(card) || _.isUndefined(card || identity.length !== 12)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: card"));
        return def.promise;
    }
    if (_.isNull(sex) || _.isUndefined(sex)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: sex"));
        return def.promise;
    }
    if (_.isNull(birthday) || _.isUndefined(birthday)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: birthday"));
        return def.promise;
    }
    if (_.isNull(job) || _.isUndefined(job)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: job"));
        return def.promise;
    }
    
    dataModels.Patient.count({'identity':identity},function(err,count){
        if(err){
            def.reject(err);
        } else if(count>=1){
            def.reject(new exceptions.ResourceNotFoundException("Patient Already Exists"));
        } else {
            var patient = new dataModels.Patient({
                name:name,
                identity:identity,
                card:card,
                sex:sex,
                birthday:birthday,
                job:job
            });
            patient.save(function(err,patient){
                if(err){
                    def.reject(err);
                } else if (_.isNull(patient)){
                    def.reject(new exceptions.ResourceNotFoundException("Fail To Insert New Patient"));
                } else {
                    dataModels.User.findByIdAndUpdate(userid,{$addToSet:{patients:patient._id}},function(err,res){ 
                        if(err){
                            def.reject(err);
                        } else if(_.isNull(res)) {
                            der.reject(new exceptions.ResourceNotFoundException('Fail To Bind Patient'));
                        } else { 
                            def.resolve(patient._id);
                        }
                    })
                }
            });
       }
    });
    return def.promise;
}


/**
 *Unbind patient with user
 *@method unbindPatient
 *@param {String} userid
 *@param {String} patientid
 *@return {Promise} status
 */

module.exports.unbindPatient = function(userid,patientid){
    var def = q.defer();
    
    if (_.isNull(userid) || _.isUndefined(userid)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: userid"));
        return def.promise;
    }
    if (_.isNull(patientid) || _.isUndefined(patientid)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: patientid"));
        return def.promise;
    }
    dataModels.Patient.findByIdAndRemove(patientid,function(err,result){
        if(err){
            def.reject(err);
        } else if(_.isNull(result)){
            def.reject(new exceptions.ResourceNotFoundException('No Patient With Id: ' + patientid));
        } else {
    	    dataModels.User.findByIdAndUpdate(userid,{$pull:{patients: patientid}},function(err,res){
	        if(err){
                    def.reject(err);
                } else if(_.isNull(res)){
                    def.reject(new exceptions.ResourceNotFoundException('No User With Id: ' + userid));
                } else {
                    def.resolve(true);
                }
           });
        }
    });
    return def.promise;
}


/**
 *Get patient details
 *@method getById
 *@param {String} patientid
 *@return {Promise} patient details
 */

module.exports.getById = function(patientid){
    var def = q.defer();

    if (_.isNull(patientid) || _.isUndefined(patientid)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: patientid"));
        return def.promise;
    }
    dataModels.Patient.findById(patientid,{__v:0},function(err,res){
        if(err){
            def.reject(err);
        } else if (_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No patient with id: " + patientid));
        } else {
            def.resolve(res.toObject());
        }
   });
   return def.promise;
}

/**
 *Search patient
 *@method getByKeyword
 *@param {String} keyword
 *@return {Promise} patient list
 */
module.exports.getByKeyword = function(keyword){
   var def = q.defer();

   if(_.isNull(keyword) || _.isUndefined(keyword)){
       def.reject(exceptions.ArgumentException('Invalid parameter: keyword'));
       return def.promise;
   }
   dataModels.Patient.find({name:keyword},{__v:0},function(err,res){
        if(err){
            def.reject(err);
        } else if (_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No patient with name: " + keyword));
        } else {
            def.resolve(res);
        }
   });
   return def.promise;
}
