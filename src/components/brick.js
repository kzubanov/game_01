'use strict';

import GameComponent from './game_component.js';


export default function Brick(options) {
    return new GameComponent(Object.assign( options, {
        
        //предзаданные параметры
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        backgroundImage: 'brick.png',
        type: 'brick',
        randomImage: true,
        spriteLength: 2,
        
        //а это из опций
        top: options.top,
        left: options.left,
    }));
}