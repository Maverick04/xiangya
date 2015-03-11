/**
 *@module Repositories
 *@class DoctorRepositories
 */

var _ = require('underscore'),
    q = require('q'),
    dataModels = require('../data_models'),
    exceptions = require('../../exceptions'),
    rand = require('csprng'),
    crypto = require('crypto');

//Public functions

/**
 *Authenticate docotr's credentail
 *@method basicAuthenticate
 *@param {String} email
 *@param {String} password 
 *@return {Promise} doctor object
 */
module.exports.basicAuthenticate = function(email,password){
    var def = q.defer();
    if (_.isNull(email) || _.isUndefined(email)){
        def.reject(new exceptions.ArgumentException("Missing argument email"));
        return def.promise;
    }
    if (_.isNull(password) || _.isUndefined(password)) {
        def.reject(new exceptions.ArgumentException("Missing argument password"));
        return def.promise;
    }
    
    dataModels.Doctor.findOne({'email':email},{'_id':0,'__v':0},function(err,res){
        if(err){
	    def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No Doctor With Email: " + email));
        } else {
           if(password === res.password){
               res=res.toObject();
               delete res.password;
               def.resolve(res);
           } else {
               def.resolve('Wrong Password');
           }
        }
    }); 
    return def.promise;
}

/**
 *Find a doctor using doctor name
 *@method getByName
 *@param {String} name
 *return {Promise} doctor object
 */
module.exports.getByName =function(name){
    var def = q.defer();
    if (_.isNull(name) || _.isUndefined(name)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: Name"));
        return def.promise;
    }
    dataModels.Doctor.findOne({"name":name},{'__v':0,'password':0},function(err,res){
    	if(err){
            def.reject(err);
        } else if (_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No doctor with name: " + name));
        } else {
            def.resolve(res.toObject());
        }
   });
   return def.promise;
}

/**
 *Find a doctor using doctorid
 *@method getById
 *@param {String} doctorid
 *return {Promise} doctor object
 */
module.exports.getById =function(doctorid){
    var def = q.defer();
    if (_.isNull(doctorid) || _.isUndefined(doctorid)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: doctorid"));
        return def.promise;
    }
    dataModels.Doctor.findById(doctorid,{'__v':0,'password':0},function(err,res){
        if(err){
            def.reject(err);
        } else if (_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No doctor with id: " + doctorid));
        } else {
            def.resolve(res.toObject());
        }
   });
   return def.promise;
}


/**
 *Register a doctor
 *@method registerDoctor
 *@param {String} email
 *@param {String} password 
 *@param {String} username
 *@param {String} departmentId
 *return {Promise} user object
 */
module.exports.registerDoctor =function(email,password,username,departmentId){
    var def=q.defer();
    var emailRe=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        passwordRe=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        usernameRe=/^[a-zA-Z]{1}\w{5,9}$/;
    
    if (_.isNull(email) || _.isUndefined(email) || !emailRe.test(email)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: email"));
        return def.promise;
    }
    if (_.isNull(password) || _.isUndefined(password) || !passwordRe.test(password)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: password"));
        return def.promise;
    }
    if (_.isNull(username) || _.isUndefined(username) || !usernameRe.test(username)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: username"));
        return def.promise;
    }

    dataModels.Doctor.count({'email':email},function(err,count){
        if(err){
	    def.reject(err);
        } else if(count>=1){
            def.reject(new exceptions.ResourceNotFoundException("Email Already Exists"));
        } else {
            var doctor = new dataModels.Doctor({
                username:username,
                email:email,
                departmentId:departmentId,
                password:password
            }); 
            doctor.save(function(err,user) {
                if(err){
                    def.reject(err);
                } else if (_.isNull(user)){
                    def.reject(new exceptions.ResourceNotFoundException("Fail To Insert New User"));
                } else {
                    user=user.toObject(); 
                    delete user.password;
                    delete user.__v;
                    def.resolve(user);
                }
            });
        }  
    });
    return def.promise;
}


/**
 *Complete the doctor information
 *@method completeDoctor
 *@param {String} doctorid
 *@param {String} name:
 *@param {String} sex
 *@param {String} birthday
 *@param {String} description
 *@param {String} title
 *@return {Promise} doctor object
 */

module.exports.completeDoctor = function(doctorid,name,sex,birthday,description,title){
    var def = q.defer();
    
    if(_.isNull(doctorid) || _.isUndefined(doctorid)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: doctorid'));
        return def.promise;
    }
    if(_.isNull(name) || _.isUndefined(name)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: name'));
        return def.promise;
    }
    if(_.isNull(sex) || _.isUndefined(sex)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: sex'));
        return def.promise;
    }
    if(_.isNull(birthday) || _.isUndefined(birthday)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: birthday'));
        return def.promise;
    }
    if(_.isNull(description) || _.isUndefined(description)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: description'));
        return def.promise;
    }
    if(_.isNull(title) || _.isUndefined(title)){
        def.reject(new exceptions.ArgumentException('Invalid parameter: title'));
        return def.promise;
    }

    dataModels.Doctor.findByIdAndUpdate(doctorid,{'name':name,'sex':sex,'birthday':birthday,'description':description,'title':title},function(err,res){
        if(err){
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException('No doctor with id:' + doctorid));
        } else {
            res=res.toObject();
            delete res.__v;
            delete res.password;
            def.resolve(res);
        }
    });
    return def.promise;
}



/**
 *Reset the password
 *@method resetPassword
 *@param {String} email
 *@param {String} password
 *return {Promise} password reset status
 */
module.exports.resetPassword =function(email,password){
    var def = q.defer();
    var emailRe=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        passwordRe=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    
    if (_.isNull(email) || _.isUndefined(email) || !emailRe.test(email)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: email"));
        return def.promise;
    }
    if (_.isNull(password) || _.isUndefined(password) || !passwordRe.test(password)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: password"));
        return def.promise;
    }
     
    dataModels.Doctor.findOneAndUpdate({'email':email},{'password':password},function(err,res){
    	if(err){
           def.reject(err);
    	} else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException('No User With Email: ' + email));
    	} else {
            def.resolve(true);
    	} 
    });
    return def.promise;
}
