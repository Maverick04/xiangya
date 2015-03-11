/**
 *@module Repositories
 *@class UserRepositories
 */

var _ = require('underscore'),
    q = require('q'),
    dataModels = require('../data_models'),
    exceptions = require('../../exceptions'),
    rand = require('csprng'),
    crypto = require('crypto');

//Public functions

/**
 *Authenticate user's credentail
 *@method basicAuthenticate
 *@param {String} email
 *@param {String} password 
 *@return {Promise} user object
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
    
    dataModels.User.findOne({'email':email},{'__v':0},function(err,res){
        if(err){
	    def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No User"));
        } else {
           if(crypto.createHash('sha512').update(password,res.salt).digest('hex') === res.password){
               res=res.toObject();
               delete res.password;
               delete res.salt;
               def.resolve(res);
           } else {
               def.reject('Wrong Email Or Password');
           }
        }
    }); 
    return def.promise;
}

/**
 *Find A User using email
 *@method getByEmail
 *@param {String} email
 *return {Promise} user object
 */
module.exports.getByEmail =function(email){
    var def = q.defer();
    if (_.isNull(email) || _.isUndefined(email)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: Email"));
        return def.promise;
    }
    dataModels.User.findOne({"email":email},{'username':1,'phone':1,'profile':1,'patients':1},function(err,user){
    	if(err){
            def.reject(err);
        } else if (_.isNull(user)){
            def.reject(new exceptions.ResourceNotFoundException("No user with email: " + email));
        } else {
            def.resolve(user.toObject());
        }
   });
   return def.promise;
}

/**
 *Find A User using userid
 *@method getById
 *@param {String} userid
 *return {Promise} user object
 */
module.exports.getById =function(userid){
    var def = q.defer();
    if (_.isNull(userid) || _.isUndefined(userid)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: userid"));
        return def.promise;
    }
    dataModels.User.findById(userid,{'username':1,'phone':1,'profile':1,'patients':1},function(err,user){
        if(err){
            def.reject(err);
        } else if (_.isNull(user)){
            def.reject(new exceptions.ResourceNotFoundException("No user with id: " + userid));
        } else {
            def.resolve(user.toObject());
        }
   });
   return def.promise;
}


/**
 *Register user
 *@method registerUser
 *@param {String} email
 *@param {String} password 
 *@param {String} username
 *return {Promise} userid
 */
module.exports.registerUser =function(email,password,username){
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

    dataModels.User.count({'email':email},function(err,count){
        if(err){
	    def.reject(err);
        } else if(count>=1){
            def.reject(new exceptions.ResourceNotFoundException("Email Already Exists"));
        } else {
            salt = rand(160,32);
            var user = new dataModels.User({
                username:username,
                email:email,
                password:crypto.createHash('sha512').update(password,salt).digest('hex'),
                salt:salt
            }); 
            user.save(function(err,user) {
                if(err){
                    def.reject(err);
                } else if (_.isNull(user)){
                    def.reject(new exceptions.ResourceNotFoundException("Fail To Insert New User"));
                } else {
                    user=user.toObject(); 
                    delete user.password;
                    delete user.salt;
                    delete user.__v;
                    def.resolve(user);
                }
            });
        }  
    });
    return def.promise;
}


/**
 *Bind the phone number
 *@method bindPhone
 *@param {String} userid
 *@param {String} phone
 *return {Promise} bind status 
 */
module.exports.bindPhone =function(userid,phone){
    var def = q.defer();
    var phoneRe = /^1[358]{1}[0-9]{9}$/;
    
    if (_.isNull(userid) || _.isUndefined(userid) ){
        def.reject(new exceptions.ArgumentException("Invalid parameter: userid"));
        return def.promise;
    }
    if (_.isNull(phone) || _.isUndefined(phone) || !phoneRe.test(phone)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: phone"));
        return def.promise;
    }
    
    dataModels.User.findByIdAndUpdate(userid,{'phone':phone},function(err,res){
	if(err){
            def.reject(err);
        } else if (_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No User With Id: " + userid));
        } else {
            def.resolve(true);
        }
    });
    return def.promise;
}


/**
 *Unbind the phone number
 *@method unbindPhone
 *@param {String} userid
 *return {Promise} unbind status 
 */
module.exports.unbindPhone =function(userid){
    var def = q.defer();
    if (_.isNull(userid) || _.isUndefined(userid) ){
        def.reject(new exceptions.ArgumentException("Invalid parameter: userid"));
        return def.promise;
    }
    
    dataModels.User.findByIdAndUpdate(userid,{'phone':null},function(err,res){
	if(err){
            def.reject(err);
        } else if (_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No User With Id: " + userid));
        } else {
            def.resolve(true);
        }
    });
    return def.promise;
}


/**
 *Update the profile
 *@method updateProfile
 *@param {String} userid
 *@param {String} profile
 *return {Promise} image_url
 */
module.exports.updateProfile =function(userid,profile){
    var def = q.defer();
    if (_.isNull(userid) || _.isUndefined(userid) ){
        def.reject(new exceptions.ArgumentException("Invalid parameter: userid"));
        return def.promise;
    }
    if (_.isNull(profile) || _.isUndefined(profile) ){
        def.reject(new exceptions.ArgumentException("Invalid parameter: profile"));
        return def.promise;
    }
    dataModels.User.findByIdAndUpdate(userid,{'profile':profile},function(err,res){
	if(err){
            def.reject(err);
        } else if (_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException("No User With Id: " + userid));
        } else {
            def.resolve(true);
        }
    });
    return def.promise;
}

/**
 *Reset the password
 *@method resetPassword
 *@param {String} userid
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
     
    salt = rand(160,32);
    password = crypto.createHash('sha512').update(password,salt).digest('hex'),
    dataModels.User.findOneAndUpdate({'email':email},{'salt':salt,'password':password},function(err,res){
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


/**
 *Get Patient List
 *@method getAllPatients
 *@param {String} userid
 *return {Promise} patient list
 */
module.exports.getAllPatients =function(userid){
    var def = q.defer();
    if(_.isNull(userid) || _.isUndefined(userid)){
        def.reject(new exceptions.ArgumentException("Invalid parameter: userid"));
    }
    
    dataModels.User.findById(userid,{_id:0,patients:1},function(err,res){
        if(err){
            def.reject(err);
        } else if(_.isNull(res)){
            def.reject(new exceptions.ResourceNotFoundException('No user with id: ' + userid));
        } else {
            dataModels.Patient.find({'_id':{$in:res.patients}},{'name':1,'sex':1},function(err,patients){
                if(err){
                    def.reject(err);
                } else if(_.isNull(patients)){ 
                    def.reject(new exceptions.ResourceNotFoundException('No Patients Found'));
                } else {
                    def.resolve(patients);
                }
            });
        }
    });
    return def.promise;
}
