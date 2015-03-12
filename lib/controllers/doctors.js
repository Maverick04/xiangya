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

