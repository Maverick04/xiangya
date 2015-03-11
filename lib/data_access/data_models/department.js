/**
  *@module DataModels
  *@class DepartmentDataModel
  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var departmentSchema = new Schema({
    name: { type:String,required:true}
});

module.exports = mongoose.model('department',departmentSchema);
