'use strict';

const path = require('path');
const pixel = require('pixel');
const fs = require('fs');
const blockTypes = require('./src/block_types.js');
const utils = require('./src/utils.js');
const levelSettings = require('./src/level_settings.js');


let level = path.join(__dirname, 'res', 'level.png');

let levelObject = {};

pixel.parse(level).then(function(images){
  
  let width = images[0].width;
  let height = images[0].height;
  let data = images[0].data;

  // потом у разных уровней будут разные планы скорости и разные темы
  // но пока все одинаково и хранится в levelSettings
  // length пишем чтобы потом удобно раздирать в массив
  levelObject = {
    blocks: {
      length: height,
    },
    theme: levelSettings.data.theme,
    speedPlan: { 
      "0" : {
        start: 0,
        finish: 20,
        speedBoost: false,
        speed: levelSettings.data.speed,
      },
      length: 1,
    }
  }

  // бежим двумерным циклом по картинке
  // слева направо, сверху вниз
  for (let h = 0; h < height; h++) {
    
    levelObject.blocks[h] = {
      length: width,
    }

    for (let w = 0; w < width; w++) {
      
      // записываем соответствующие w, h значения rgb в объект
      let pixelData = {};
      pixelData.r = data[h * 4 * width + w * 4];
      pixelData.g = data[h * 4 * width + w * 4 + 1];
      pixelData.b = data[h * 4 * width + w * 4 + 2];

      // ищем такой цвет в blockTypes
      for (let key in blockTypes.data) {
        if ( utils.isColorMatch( blockTypes.data[key], pixelData ) ) {
          levelObject.blocks[h][w] = {
            type: key,
          }
          break;
        }
      }

      // если не находим, то ставим пусто
      if ( !levelObject.blocks[h][w] ) {
        levelObject.blocks[h][w] = {
          type: 'empty',
        }
      }

    }
  }

  // теперь у нас есть записанный объект с типами блоков, 
  // нужно только сделат JSON и записать в файл
  utils.levelWriter( 0, JSON.stringify(levelObject) );
});