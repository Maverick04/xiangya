/**
  *module DataModels
  *class AuthDataModel
  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var authSchema = new Schema({
     doctorId:ObjectId,
     recordId:ObjectId,
         date:{type:Date, default: new Date()},
         type:Boolean
});

module.exports = mongoose.model('auth',authSchema);
