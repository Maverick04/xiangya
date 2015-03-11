/**
  *module DataModels
  *class DoctorDataModel
  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var doctorSchema = new Schema({
    username:{
	type:String,
    required:true
    },
       email:{
        type:String,
    required:true
    },
    password:{
        type:String,
    required:true
    },
    departmentId:{
        type:ObjectId,
    required:true
    },
    name:String,
    sex:Boolean,
    birthday:Date,
    introduction:String,
    title:String,
});

module.exports = mongoose.model('doctor',doctorSchema);
