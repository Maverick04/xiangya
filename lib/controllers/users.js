/**
 *@module Controllers
 *@class UserController
 */

var _ = require('underscore'),
    dataAccess = require('../data_access'),
    util = require('../util'),
    exceptions = require('../exceptions');

//Public interfaces

/**
  *POST /user/account
  *register a user in the system
  *@method registerUser
  */
module.exports.registerUser = function(req,res){
    if(_.has(req.body,"email") && _.has(req.body,"password") && _.has(req.body,"username")){
        dataAccess.user.registerUser(req.body.email,req.body.password,req.body.username)
        .then(function(user){
            res.json(user);
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
  *POST /user/bindPhone
  *bind phone number to user
  *@method bindPhone
  */
module.exports.bindPhone = function(req,res){ 
    if(_.has(req.user,'_id') && _.has(req.body,'phone')){
        dataAccess.user.bindPhone(req.user._id,req.body.phone)
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
  *POST /user/unbindPhone
  *unbindPhonend phone number from user
  *@method unbindPhone
  */
module.exports.unbindPhone = function(req,res){ 
    if(_.has(req.user,'_id')){
        dataAccess.user.unbindPhone(req.user._id)
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
  *POST /user/updateProfile
  *update a user's profile
  *@method updateProfile
  */
module.exports.updateProfile = function(req,res){
    if(_.has(req.user,'_id') && _.has(req.body,'profile')){
        dataAccess.user.updateProfile(req.user._id,req.body.profile)
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
  *POST /user/sendPassword
  *send user a random password if user lost the password
  *@method sendPassword
  */
module.exports.sendPassword = function(req,res){
    if(_.has(req.body,'email')){
        dataAccess.user.getByEmail(req.body.email)
        .then(function(user){
            var password = util.string.randomGenerator(6,'letter')+util.string.randomGenerator(2,'number')+util.string.randomGenerator(2,'non-reg');
            util.mail.sendPassword(req.body.email,password)
            .then(function(result){
                dataAccess.user.resetPassword(req.body.email,password)
                .then(function(result){
                    res.json(result);
                })
                .fail(function(err){
                    exceptions.errorResponse(res,err);
                })
                .done();
            })
            .fail(function(err){
                exceptions.errorResponse(res,err);
            })
            .done()
            
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
  *POST /user/resetPassword
  *reset user's password
  *@method resetPassword
  */
module.exports.resetPassword = function(req,res){
    if(_.has(req.user,'_id') && _.has(req.body,'email') && _.has(req.body,'password')){
        dataAccess.user.resetPassword(req.user.email,req.body.password)
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
  *POST /user/bindPatient
  *bind a patient to user
  *@method bindPatient
  */
module.exports.bindPatient = function(req,res){ 
    if(_.has(req.user,'_id') && _.has(req.body,'name') && _.has(req.body,'identity') && _.has(req.body,'card') && _.has(req.body,'sex') && _.has(req.body,'birthday') && _.has(req.body,'job')){
        dataAccess.patient.bindPatient(req.user._id,req.body.name,req.body.identity,req.body.card,req.body.sex,req.body.birthday,req.body.job)
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
  *POST /user/unbindPatient
  *unbindPatient phone number from user
  *@method unbindPatient
  */
module.exports.unbindPatient = function(req,res){ 
    if(_.has(req.user,'_id') && _.has(req.body,'patientid')){
        dataAccess.patient.unbindPatient(req.user._id,req.body.patientid)
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
  *GET /user/patient
  *get the detials about a patient
  *@method getPatientById
  */
module.exports.getPatientById = function(req,res){ 
    if(_.has(req.user,'_id') && _.has(req.params,'patientid')){
        dataAccess.patient.getById(req.params.patientid)
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
  *GET /user/patients
  *get all the patients binded with the user 
  *@method getPatientById
  */
module.exports.getAllPatients = function(req,res){ 
    if(_.has(req.user,'_id')){
        dataAccess.user.getAllPatients(req.user._id)
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

