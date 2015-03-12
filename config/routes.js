var _ = require('underscore'),
    auth = require('./auth'),
    multer = require('multer'),
    userController = require('../lib/controllers/users'),
    doctorController = require('../lib/controllers/doctors');
//Append the controllers behind

//Public interface 
module.exports = function(app){
    app.get("/server_test.html",function(req,res){
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write("Server is OK!");
        res.end();
   });

   app.post('/upload/user',multer({dest:'./images/uprofile'}),function(req,res){ res.json(req.files); });
   app.post('/upload/doctor',multer({dest:'./images/dprofile'}),function(req,res){ res.json(req.files); });
   app.post('/upload/record',multer({dest:'./images/records'}),function(req,res){ res.json(req.files); });
    


  
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
  
   //Doctor Accout Resource
   app.get("/doctor/account",auth.basicAuthDoctor,function(req,res){res.status(200).send(req.doctor);});
   app.get("/doctor/account/:name",doctorController.getDoctorByName);
    
};
