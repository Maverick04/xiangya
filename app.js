/**
 *Module dependencies.
 */
var Q = require('q'),
    express = require('express'),
    fs = require('fs'),
    errorhandler=require('errorhandler'),
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

app.settings.mongo = require('./config/environment.js')(app.get('env'));
console.log('Running environment: ' + app.settings.env);

//Configuration
if(app.get('env') === "development"){
    app.use(errorhandler());
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
app.use(session({resave:true,secret:'secret123',saveUninitialized:true}));

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
