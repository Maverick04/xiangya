/**
 *Module dependencies.
 */
var Q = require('q'),
    express = require('express'),
    fs = require('fs'),
    dataAccess = require('./lib/data_access'),
    config = require('./config/config'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    timeout = require('connect-timeout'),
    multer = require('multer'),
    path = require('path');

var app = express();

var logStream = fs.createWriteStream('web.log',{
    'flags':'a',
    'encoding':'utf8',
    'mode':0666
});

app.set('title','Xiangya-Server');
app.settings.env = process.env.NODE_ENV || "production";
if (!process.env.NODE_ENV) process.env.NODE_ENV = app.settings.env;

console.log('Running environment: ' + app.settings.env);

//Configuration
if(app.get('env') === "development"){
    app.use(require('errorhandler')());
}


//Create images folders
if (!fs.existsSync(config().userProfile)) {
    fs.mkdirSync(config().userProfile);
}

if (!fs.existsSync(config().doctorProfile)) {
    fs.mkdirSync(config().doctorProfile);
}

if (!fs.existsSync(config().recordImage)) {
    fs.mkdirSync(config().recordImage);
}




if(app.get('env') === "production"){
    var dataAccess = require('./lib/data_access');
    var user = require('./lib/data_access/data_models/user');
    var department = require('./lib/data_access/data_models/department');
    var auth = require('./lib/data_access/data_models/auth_history');
    var doctor = require('./lib/data_access/data_models/doctor');
    var record = require('./lib/data_access/data_models/record');
    var patient = require('./lib/data_access/data_models/patient');
    var entity = require('./lib/data_access/data_models/entity');

    dataAccess.reset(department)
    	.then(function(){
            return dataAccess.reset(user);
        })
    	.then(function(){
            return dataAccess.reset(auth);
    	})
     	.then(function(){
            return dataAccess.reset(patient);
    	})
        .then(function(){
            return dataAccess.reset(doctor);
    	})
        .then(function(){
            return dataAccess.reset(record);
    	})
        .then(function(){
            return dataAccess.reset(entity);
        })
        .then(function(){
    	    return dataAccess.seed(department,require(path.join(__dirname, 'config/seed_data/department.json')));
        })
        .then(function(){
            return dataAccess.seed(user,require(path.join(__dirname, 'config/seed_data/user.json')));
        })
        .then(function(){
            return dataAccess.seed(doctor,require(path.join(__dirname, 'config/seed_data/doctor.json')));
        })
        .then(function(){
            return dataAccess.seed(patient,require(path.join(__dirname, 'config/seed_data/patient.json')));
        })
        .then(function(){
            return dataAccess.seed(auth,require(path.join(__dirname, 'config/seed_data/auth_history.json')));
        })
        .then(function(){
            return dataAccess.seed(record,require(path.join(__dirname, 'config/seed_data/record.json')));
        })
        .then(function(){
            return dataAccess.seed(entity,require(path.join(__dirname, 'config/seed_data/entity.json')));
        })
        .then(function(res){ console.log("Database Cleaned!");},function(err){console.log(err)});
}


process.on('uncaughtException',function(error){
    console.log('Caught exception: ');
    console.log(error);
    fs.appendFile('error.log',error.message + "\n", function(err) {
        if(err){
            console.log(err.message);
            console.log(err.stack);
        } else {
            console.log("The file was saved")
        }
        process.exit();
    });
});

app.use(timeout('2s'));
app.use(morgan('dev',{stream:logStream}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(multer());

//Routing setup 
require('./config/routes')(app);

//Environment specific setup
app.set('port',process.env.PORT || 8000);
var server = require('http').createServer(app);
server.listen(app.get('port'),function(){
    if (app.settings.env != 'test') {
         console.log("Express server %s is listening on port %d in %s mode",app.get('title'),app.get('port'),app.settings.env);
    }
});

module.exports = app;
