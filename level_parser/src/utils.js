'use strict'

exports.isColorMatch = function(colorA, ColorB, inaccuracy = 10) {
    let difference = Math.abs( colorA.r - ColorB.r ) + Math.abs( colorA.g - ColorB.g ) + Math.abs( colorA.b - ColorB.b );
    return difference < inaccuracy;
}



const fs = require('fs');
const path = require('path');

exports.levelWriter = function(num, data) {
    
    function levelName(num) {
        return 'level_' + num + '.json';
    }

    fs.writeFile( path.join(__dirname, '..', '..', 'src', 'levels', levelName(num)), data, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('файл level_' + num + '.json сохранен');
    });
}