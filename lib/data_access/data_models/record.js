/**
  *module DataModels
  *class RecordDataModel
  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    _ = require('underscore');
    //type should be:initial,checkin,photos,repeat,checkout

var recordSchema = new Schema({
    patientId:ObjectId,
    departmentId:ObjectId,
    hospitalName:String,
    keywords:[String],
    details:[ObjectId],
    createDate:{type:Date,default:new Date()}
});

module.exports = mongoose.model('record',recordSchema);
