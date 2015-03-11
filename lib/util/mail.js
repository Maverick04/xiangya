var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    _ = require('underscore'),
    q = require('q'),
    exceptions = require('../exceptions');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport(smtpTransport({
    host:'smtp.126.com',
    port:25,
    auth: {
        user: 'raincent@126.com',
        pass: 'ygline007'
    }
    }));

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

/*
// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'XiangYa <raincent@126.com>', // sender address
    to: 'raincent@126.com',             // list of receivers
    subject: 'Hello',                   // Subject line
    text: 'Hello world',                // plaintext body
    html: '<b>Hello world </b>'         // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});
*/


module.exports.sendPassword = function(to,password){
    var def = q.defer();
    
    if(_.isNull(to) || _.isUndefined(to)){
        def.reject(new exceptions.ArgumentException('Invalid Parameter: to'));
        return def.promise;
    }
    if(_.isNull(password) || _.isUndefined(password)){
        def.reject(new exceptions.ArgumentException('Invalid Parameter: password'));
        return def.promise;
    }
    
    var mailOptions = {
        from: 'XiangYa <raincent@126.com>',          // sender address
        to: to,                                      // list of receivers
        subject: 'New Password',                     // Subject line
        text: 'Your New Password Is: ' + password,   // plaintext body
    };
     
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            def.reject(error);
        }else{
            def.resolve(true);
        }
    });
    return def.promise;
}
