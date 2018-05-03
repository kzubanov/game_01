'use strict';


//здесь собираем лэйаут для игры
//менб будем собирать отдельно, слоем выше

let screen = document.createElement('div');
screen.classList.add('screen');
gameLayout = document.createElement('div');
gameLayout.classList.add('game_view');
screen.append(gameLayout);

//создаем блоки
levelController.blocks.forEach( (controllerLine, lineIndex) => {
    controllerLine.forEach( (controllerBlock, blockIndex) => {
        //расставляем блоки
        switch (controllerBlock.type) {
            case 'brick':
                new GameComponent.Brick({
                    left: BLOCK_WIDTH * blockIndex,
                    top: BLOCK_HEIGHT * lineIndex,
                });
                break;
            case 'start':
                new GameComponent.Gate({
                    left: BLOCK_WIDTH * (blockIndex - 1),
                    top: BLOCK_HEIGHT * (lineIndex - 3),
                });
                break;
            case 'finish':
                new GameComponent.Gate({
                    left: BLOCK_WIDTH * (blockIndex - 1),
                    top: BLOCK_HEIGHT * (lineIndex - 3),
                });
                break;
        }
    });
});

document.body.append(screen);