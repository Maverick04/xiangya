/**
  *@module DataModels
  *@class UserDataModel
  */

var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    username: {
	type: String,
    required: true
    },
       email: {
        type: String,
    required: true
    },
    password: {
        type: String,
    required: true
    },
        salt: {
        type: String,
    required: true
    },
       phone: {
        type: String,
     default: null
    },
     profile: {
        type: String,
     default: "" 
    },
    patients: [ObjectId]
});

module.exports = mongoose.model('user',userSchema);
