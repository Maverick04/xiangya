var _ = require('underscore'),
    auth = require('./auth'),
    express = require('express'),
    config = require('./config'),
    userController = require('../lib/controllers/users'),
    entityController = require('../lib/controllers/entity'),
    recordController = require('../lib/controllers/records'),
    doctorController = require('../lib/controllers/doctors');
//Append the controllers behind

//Public interface 
module.exports = function(app){
    app.get("/server_test.html",function(req,res){
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write("Server is OK!");
        res.end();
   });
    
   app.use("/images/user/",express.static(config().userProfile));
   app.use("/images/doctor/",express.static(config().doctorProfile));
   app.use("/images/record/",express.static(config().recordImage));
   

   //Append other routes
   //User Account Resource
   app.post("/user/account",userController.registerUser);
   app.get("/user/account",auth.basicAuth,function(req,res){res.status(200).send(req.user);});
   app.post("/user/bindPhone",auth.basicAuth,userController.bindPhone);
   app.post("/user/unbindPhone",auth.basicAuth,userController.unbindPhone);
   app.post("/user/updateProfile",auth.basicAuth,userController.updateProfile);
   app.post("/user/sendPassword",userController.sendPassword);
   app.post("/user/resetPassword",auth.basicAuth,userController.resetPassword);
   app.post("/user/bindPatient",auth.basicAuth,userController.bindPatient);
   app.post("/user/unbindPatient",auth.basicAuth,userController.unbindPatient);
   app.get("/user/patient/:patientid",userController.getPatientById);
   app.get("/user/patients",auth.basicAuth,userController.getAllPatients);
  
   //Doctor Accout Resource
   app.get("/doctor/account",auth.basicAuthDoctor,function(req,res){res.status(200).send(req.doctor);});
   app.get("/doctor/account/:name",doctorController.getDoctorByName);
   app.get("/doctor/department",doctorController.getAllDepartments);
   app.post("/doctor/account",doctorController.registerDoctor);
   app.post("/doctor/update",auth.basicAuthDoctor,doctorController.updateDoctor);
   app.post("/doctor/sendpass",doctorController.sendPassword);
   app.post("/doctor/resetpass",auth.basicAuthDoctor,doctorController.resetPassword);

   //Record Resource
   app.post("/record/create",auth.basicAuth,recordController.createRecord);
   app.get("/record/:recordid",recordController.getById);
   app.post("/record/keyword",auth.basicAuth,recordController.updateKeyword);
   app.post("/record/addentity",auth.basicAuth,recordController.addEntity);
   app.post("/record/delentity",auth.basicAuth,recordController.removeEntity);
   app.get("/record/keyword/:keyword",auth.basicAuthDoctor,recordController.getByKeywords);
   app.get("/recorddoc",auth.basicAuthDoctor,recordController.getByDoctor);
   app.get("/recordpat/:patientid",auth.basicAuthDoctor,recordController.getByPatient);
   app.get("/recordauth/:recordid",auth.basicAuthDoctor,recordController.getByAuth);
   app.get("/patients/:keyword",auth.basicAuthDoctor,recordController.getPatients);
   
   //Entity Resource
   app.post("/entity/create",auth.basicAuth,entityController.createEntity);
   app.get("/entity/:entityid",auth.basicAuth,entityController.getById);
   app.post("/entity/addImage",auth.basicAuth,entityController.addImage);
   app.post("/entity/removeImage",auth.basicAuth,entityController.removeImage);
   app.post("/entity/remove",auth.basicAuth,entityController.remove);

};
