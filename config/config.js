var _ = require('underscore'),
    path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

var config = {   paths:{
	             userProfile: path.join(__dirname,""),
	             doctorProfile: path.join(__dirname,""),
	             recordImage: path.join(__dirname,"")
                 }
    };
