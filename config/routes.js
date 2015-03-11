var _ = require('underscore'),
    auth = require('./auth'),
    userController = require('../lib/controllers/users');
//Append the controllers behind

//Public interface 
module.exports = function(app){
    app.get("/server_test.html",function(req,res){
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write("Server is OK!");
        res.end();
   });
   //Append other routes
   //User Account Resource
   app.post("/user/account",userController.registerUser);
   app.get("/user/account",auth.basicAuth,function(req,res){res.status(200).send(req.user);});
   app.post("/user/bindPhone",auth.basicAuth,userController.bindPhone);
   app.post("/user/unbindPhone",auth.basicAuth,userController.unbindPhone);
   app.post("/user/updateProfile",auth.basicAuth,userController.updateProfile);
   app.post("/user/sendPassword",userController.sendPassword);
   app.post("/user/resetPassword",auth.basicAuth,userController.resetPassword);
   app.post("/user/unbindPatient",auth.basicAuth,userController.unbindPatient);
   app.get("/user/patient/:patientid",auth.basicAuth,userController.getPatientById);
   app.get("/user/patients",auth.basicAuth,userController.getAllPatients);
   
};
