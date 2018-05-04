'use strict';
//описываем типичные объекты



GameComponent.Brick = function(options) {
    return new GameComponent({
        
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
    });
}

GameComponent.Gate = function(options) {
    return new GameComponent({
        
        //предзаданные параметры
        width: BLOCK_WIDTH * 3,
        height: BLOCK_HEIGHT * 4,
        backgroundImage: 'gate.png',
        type: 'gate',
        
        //а это из опций
        top: options.top,
        left: options.left,
    });
}