/**
  *@module util
  *@class image
  */
var multer = require('multer'),
    paths = require('../../config/config');

module.exports = function(type){
    var dest;
    if (type === 'user'){
        dest = paths().userProfile;
    } else if(type === 'doctor'){
        dest = paths().doctorProfile;
    } else if(type === 'record'){
        dest = paths().recordImage;
    }
     
    var options = {
        dest : dest,
        limits:{fieldNameSize:100,files:20,fields:5},
        onFileUploadStart: function(file,req,res){console.log(file.fieldname+ ' is starting ...')},
        onFileUploadComplete: function(file,req,res){console.log(file.fieldname + ' uploaded to ' + file.path);},
        onError: function(error,next){console.log(err); next(error);}
    };

    return multer(options);

}
