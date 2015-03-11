var _ = require('underscore');

module.exports.randomGenerator = function generateRandom(lengthOfString, charset) {
    // The scope of the character
    if(_.isNull(charset) || _.isUndefined(charset)){
        charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    } else if(charset === "letter"){
        charset = 'abcdefghijklmnopqrstuvwxyz';
    } else if(charset === "number"){
        charset = '1234567890';
    } else if(charset === "non-reg"){
        charset = '!@#$%^&*';
    }

    var rand = '';

    while(lengthOfString > 0) {
        /*
        since the index of char is start from 0, so no need to +1 on the random number
        we want the range from 0 - lengthOfString
        */
        rand += charset.charAt(Math.floor(Math.random() * charset.length));
        lengthOfString--;
    }
    return rand;
}
