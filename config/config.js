var _ = require('underscore'),
    path = require('path'),
    fs = require('fs');

module.exports = function() {
    var paths = {
        userProfile: path.join(__dirname,"../images/uprofile"),
        doctorProfile: path.join(__dirname,"../images/dprofile"),
        recordImage: path.join(__dirname,"../images/records")
    };
    return paths;
};
