'use strict';

import Brick from './components/brick.js';
import Gate from './components/gate.js';
import * as Utils from './utils.js';
import CONSTANTS from './constants.js';

//здесь собираем лэйаут для игры
//менб будем собирать отдельно, слоем выше


export default class GameView {
    constructor(levelController) {
        
        // все время нужно обновлять кучу элементов
        // для этого завели стэк в котором храним ссылки на эти элементы, чтобы потом по всем бегать
        this.componentStack = {
            initObjects: [],
            animatedObjects: [],
        };

        levelController.gameView = this;

        this.theme = levelController.theme;
        this.hero;
        // создаем базовые элементы игры
        this.levelController = levelController;
        let gameLayout = document.createElement('div');
        gameLayout.classList.add('game_view');
        document.body.append(gameLayout);

        // gameLayout будет часто нужен
        this.gameLayout = gameLayout;
        
        this.init();
        this.updateScreenSize();

        this.gameLayout.style.width = levelController.blocks[0].length * CONSTANTS.BLOCK_WIDTH + 'px';
        this.gameLayout.style.height = levelController.blocks.length * CONSTANTS.BLOCK_HEIGHT + 'px';

    }

    updateScreenSize() {
        let screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        let screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        
        // если ширины / высоты достаточно, чтобы вместить уровень, то нет смысла двигать камеру
        this.isHeightEnouch = this.levelController.contentHeight < this.screenHeight;
        this.isWidthEnouch =  this.levelController.contentWidth + CONSTANTS.CAMERA_PADDING_X < this.screenWidth;

        this.cameraFrame = {};
        //debugger;
        if (this.isHeightEnouch) {
            this.cameraFrame.top = (screenHeight - this.levelController.contentHeight) / 2;
             // нам нужно знать на сколько мы можем упасть вниз / наверх
            this.cameraFrame.fellTreshhold = this.cameraFrame.top;
        } else {
            this.cameraFrame.top = screenHeight / 2 - (this.levelController.startPosition.y * CONSTANTS.BLOCK_HEIGHT + CONSTANTS.HERO_HEIGHT / 2);
            this.cameraFrame.fellTreshhold = CONSTANTS.CAMERA_PADDING_Y * 2;
        }

        if (this.isWidthEnouch) {
            this.cameraFrame.left = (screenWidth - this.levelController.contentWidth) / 2;
        } else {
            this.cameraFrame.left = CONSTANTS.CAMERA_PADDING_X;
        }

        this.cameraFrame.width = screenWidth;
        this.cameraFrame.height = screenHeight;
    }

    init() {
        let self = this;
        this.levelController.blocks.forEach( (controllerLine, lineIndex) => {
            controllerLine.forEach( (controllerBlock, blockIndex) => {
                //расставляем блоки
                switch (controllerBlock.type) {
                    case 'brick':
                        new Brick({
                            left: CONSTANTS.BLOCK_WIDTH * blockIndex,
                            top: CONSTANTS.BLOCK_HEIGHT * lineIndex,
                            theme: self.theme,
                            parentNode: self.gameLayout,
                            gameView: self,
                        });
                        break;
                    case 'start':
                        new Gate({
                            left: CONSTANTS.BLOCK_WIDTH * (blockIndex - 1),
                            top: CONSTANTS.BLOCK_HEIGHT * (lineIndex - 3),
                            theme: self.theme,
                            parentNode: self.gameLayout,
                            gameView: self,
                        });
                        break;
                    case 'finish':
                        new Gate({
                            left: CONSTANTS.BLOCK_WIDTH * (blockIndex - 1),
                            top: CONSTANTS.BLOCK_HEIGHT * (lineIndex - 3),
                            theme: self.theme,
                            parentNode: self.gameLayout,
                            gameView: self,
                        });
                        break;
                }
            });
        });
    }

    updateCameraPositionX() {
        if (true) {
            let leftPosition = this.hero.bounds.left + this.hero.width / 2 - this.cameraFrame.width / 2;
            this.cameraFrame.left = Math.min( -leftPosition, CONSTANTS.CAMERA_PADDING_X);
        }

    }

    updateCameraPositionY() {
        if (!this.isHeightEnouch) {

            // проверяем нужно ли двигать камеру наверх
            if (this.cameraFrame.top + this.hero.bounds.top < CONSTANTS.CAMERA_PADDING_Y) {

                // если выпал за край уровня можно немного полететь еще
                if (this.hero.isOutOfLevelTop()) {
                    this.cameraFrame.top = Math.min( CONSTANTS.CAMERA_PADDING_Y - this.hero.bounds.top, this.cameraFrame.fellTreshhold);
                    return;
                }

                // если не падаем, то двигаем камеру 
                this.cameraFrame.top = CONSTANTS.CAMERA_PADDING_Y - this.hero.bounds.top;
            }
            
            // проверяем нужно ли двигать камеру вниз
            if (this.cameraFrame.height - this.cameraFrame.top - this.hero.bounds.bottom < CONSTANTS.CAMERA_PADDING_Y) {
                if (this.hero.isOutOfLevelBottom()) {
                    this.cameraFrame.top = Math.max(
                        - (this.levelController.contentHeight + this.cameraFrame.fellTreshhold - this.cameraFrame.height),
                        this.cameraFrame.height - CONSTANTS.CAMERA_PADDING_Y - this.hero.bounds.bottom
                    );
                    return;
                }
                this.cameraFrame.top = this.cameraFrame.height - CONSTANTS.CAMERA_PADDING_Y - this.hero.bounds.bottom;
                // центрирование
                // this.cameraFrame.top = this.cameraFrame.height / 2 - this.hero.bounds.top + this.hero.height / 2;
            }
        }
    }


    updateCameraPosition() {
        this.updateCameraPositionX();
        this.updateCameraPositionY();
        this.gameLayout.style.left = this.cameraFrame.left + 'px';
        this.gameLayout.style.top = this.cameraFrame.top + 'px';
    }

    renderAll() {
        this.componentStack.animatedObjects.forEach(object => {
                object.render();
            });   
    }
}
