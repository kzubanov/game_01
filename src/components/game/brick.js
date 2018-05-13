'use strict';

import GameComponent from './../game_component.js';
import CONSTANTS from './../../utils/constants.js';


export default function Brick(options) {
    return new GameComponent(Object.assign( options, {
        
        //предзаданные параметры
        width: CONSTANTS.BLOCK_WIDTH,
        height: CONSTANTS.BLOCK_HEIGHT,
        backgroundImage: 'brick.png',
        type: 'brick',
        randomImage: true,
        spriteLength: 2,
        
        //а это из опций
        top: options.top,
        left: options.left,
    }));
}