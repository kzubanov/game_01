'use strict';

import GameComponent from './../game_component.js';
import CONSTANTS from './../../utils/constants.js';

export default function Gate(options) {
    return new GameComponent(Object.assign( options, {
        
        //предзаданные параметры
        width: CONSTANTS.BLOCK_WIDTH * 3,
        height: CONSTANTS.BLOCK_HEIGHT * 4,
        backgroundImage: 'gate.png',
        type: 'gate',
        
        //а это из опций
        top: options.top,
        left: options.left,
    }));
}
