/**
  *module DataModels
  *class PatientDataModel
  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var patientSchema = new Schema({
        name:{
            type:String,
        required:true
        },
    identity:{
            type:String,
        required:true
        },
       card:{
           type:String,
        required:true
        },
        sex:{
           type:Boolean,
        required:true
        },
   birthday:{
           type:String,
        required:true
        },
        job:{
           type:String,
        required:true
        }
});

module.exports = mongoose.model('patient',patientSchema);
