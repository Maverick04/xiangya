/**
  *@module DataModels
  *@class RecordEntityDataModel
  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    _ = require('underscore');

var entitySchema = new Schema({
    createDate:{type:Date,default:new Date()},
    type:{type:String,required:true},
    images:[String]
});

module.exports = mongoose.model('entity',entitySchema);
