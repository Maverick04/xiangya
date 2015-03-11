/**
 *Module providing access to database models handled by Mongoose
 *
 *@module DataModels
 *@property {Object} User User Data Model
 *@property {Object} Patient Patient Data Model
 *@property {Object} Doctor Doctor Data Model
 *@property {Object} Record Record Data Model
 *@property {Object} Auth Authorization Data Model
 *@property {Object} Department Department Data Model
 */

module.exports.User = require('./user');
module.exports.Doctor = require('./doctor');
module.exports.Patient = require('./patient');
module.exports.Record = require('./record');
module.exports.Department = require('./department');
module.exports.Auth = require('./auth_history');
module.exports.Entity = require('./entity');

