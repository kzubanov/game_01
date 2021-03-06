'use strict'

exports.isColorMatch = function(colorA, ColorB, inaccuracy = 10) {
    let difference = Math.abs( colorA.r - ColorB.r ) + Math.abs( colorA.g - ColorB.g ) + Math.abs( colorA.b - ColorB.b );
    return difference < inaccuracy;
}

exports.levelName = function(num, type) {
    return 'level_' + num + '.' + type;
}


const fs = require('fs');
const path = require('path');

exports.levelWriter = function(num, data) {

    fs.writeFileSync( path.join(__dirname, '..', '..', 'src', 'levels', exports.levelName(num, 'json')), data);
}