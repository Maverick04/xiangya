/**
 *@module Controllers
 *@class DoctorController
 */

var _ = require('underscore'),
    dataAccess = require('../data_access'),
    util = require('../util'),
    exceptions = require('../exceptions');

/**
  *GET /doctor/account/:name
  *get details about a doctor by name
  *@method getDoctorByName
  */
module.exports.getDoctorByName = function(req,res){
    if(_.has(req.params,'name')){
        dataAccess.doctor.getByName(req.params.name)
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
  *GET /doctors/:departmentid
  *get the doctors in a department
  *@method getDoctorsByDepartment
  */
module.exports.getDoctorsByDepartment = function(req,res){
    if(_.has(req.params,'departmentid')){
        dataAccess.doctor.getByDepartment(req.params.departmentid)
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
  *POST /doctor/account
  *register a doctor into the system
  *@method registerDoctor
  *@param {String} email
  *@param {String} password
  *@param {String} username
  *@param {String} departmentid
  */ 
module.exports.registerDoctor = function(req,res){
    if(_.has(req.body,"email") && _.has(req.body,"password") && _.has(req.body,"username") && _.has(req.body,"departmentid")){
        dataAccess.doctor.registerDoctor(req.body.email,req.body.password,req.body.username,req.body.departmentid)
        .then(function(doctor){
            res.json(doctor);
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
  *GET /doctor/department
  *get the department list
  *@method getAllDepartments
  */
module.exports.getAllDepartments = function(req,res){
    dataAccess.department.getAllDepartments()
    .then(function(result){
        res.json(result);
    })
    .fail(function(err){
        exceptions.errorResponse(res,err);
    })
    .done()
}

/**
  *POST /doctor/update
  *update a doctor's profile
  *@method updateDoctor
  *@param {String} name
  *@param {String} sex
  *@param {String} birthday
  *@param {String} description
  *@param {String} title
  */ 

module.exports.updateDoctor = function(req,res){
    if(_.has(req.doctor,"_id") &&_.has(req.body,"name") && _.has(req.body,"sex") && _.has(req.body,"birthday") && _.has(req.body,"introduction") && _.has(req.body,'title')){
        dataAccess.doctor.completeDoctor(req.doctor._id,req.body.name,req.body.sex,req.body.birthday,req.body.description,req.body.title)
        .then(function(doctor){
            res.json(doctor);
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
  *POST /doctor/sendpass
  *send a new password for the doctor
  *@method sendPassword
  *@param {String} email
  */
module.exports.sendPassword = function(req,res){
    if(_.has(req.body, 'email')){
        dataAccess.doctor.getByEmail(req.body.email)
        .then(function(doctor){
            var password = util.string.randomGenerator(6,'letter')+util.string.randomGenerator(2,'number')+util.string.randomGenerator(2,'non-reg');
            util.mail.sendPassword(req.body.email,password)
            .then(function(result){
                dataAccess.doctor.resetPassword(req.body.email,password)
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
  *POST /doctor/resetpass
  *reset doctor's password
  *@method resetPassword
  *@param {String} password
  */
module.exports.resetPassword = function(req,res){
    if(_.has(req.doctor,'email')  && _.has(req.body,'password')){
        dataAccess.doctor.resetPassword(req.doctor.email,req.body.password)
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

