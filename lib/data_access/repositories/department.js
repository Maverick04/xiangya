/**
 *@module Repositories
 *@class DepartmentRepositories
 */

var _ = require('underscore'),
    q = require('q'),
    dataModels = require('../data_models'),
    exceptions = require('../../exceptions');


//Public functions

/**
 *Get all the departments' detail
 *@return {Promise}
 */
module.exports.getAllDepartments=function(){
    var def = q.defer();
    dataModels.Department.find({},{'__v':0},function(err,res){
        if(err){
            def.reject(err); 
        } else if(_.isNull(res)){
            def.reject(exceptions.ResourceNotFoundException('No Department Information Found'));
        } else {
            def.resolve(res);
        }
    });
    return def.promise;
}
