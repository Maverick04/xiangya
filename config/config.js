var _ = require('underscore'),
    path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

var config = {};

if(process.env.NODE_ENV === "test"){
    config = {
	paths:{
	    userProfile: path.join(__dirname,""),
	    doctorProfile: path.join(__dirname,""),
	    recordImage: path.join(__dirname,"")
	}
    };
} else {
    config = {
	paths:{
	    userProfile: path.join(__dirname,""),
	    doctorProfile: path.join(__dirname,""),
	    recordImage: path.join(__dirname,"")
	}
    };
}
