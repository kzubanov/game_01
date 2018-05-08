'use strict';

import Brick from './components/brick.js';
import Gate from './components/gate.js';
import * as Utils from './utils.js';

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

        // !!! ПЕРЕПИСАТЬ !!!
        // писал в самолете без вайфая. потом посмотрю как это сделать нормально
        let screenWidth = getComputedStyle(document.body).width;
        screenWidth = screenWidth.slice(0, screenWidth.length - 2);
        let tmp = document.createElement('div');
        document.body.append(tmp);
        tmp.style.position = 'absolute';
        tmp.style.height = '100%';
        let screenHeight = getComputedStyle(tmp).height;
        screenHeight = screenHeight.slice(0, screenHeight.length - 2);

        // если ширины / высоты достаточно, чтобы вместить уровень, то нет смысла двигать камеру
        // потом эти данные будут через let и из них мы будем собирать апдейт положения камеры 
        // чтобы не дергать апдейт камеры для уровней, на которых он не нужен
        this.isHeightEnouch = this.levelController.contentHeight < this.screenHeight;
        this.isWidthEnouch =  this.levelController.contentWidth + CAMERA_PADDING_X < this.screenWidth;

        this.cameraFrame = {};
        //debugger;
        if (this.isHeightEnouch) {
            this.cameraFrame.top = (screenHeight - this.levelController.contentHeight) / 2;
             // нам нужно знать на сколько мы можем упасть вниз / наверх
            this.cameraFrame.fellTreshhold = this.cameraFrame.top;
        } else {
            this.cameraFrame.top = screenHeight / 2 - (this.levelController.startPosition.y * BLOCK_HEIGHT + HERO_HEIGHT / 2);
            this.cameraFrame.fellTreshhold = CAMERA_PADDING_Y * 2;
        }

        if (this.isWidthEnouch) {
            this.cameraFrame.left = (screenWidth - this.levelController.contentWidth) / 2;
        } else {
            this.cameraFrame.left = CAMERA_PADDING_X;
        }

        this.cameraFrame.width = screenWidth;
        this.cameraFrame.height = screenHeight;
        
        this.init();

        this.gameLayout.style.width = levelController.blocks[0].length * BLOCK_WIDTH + 'px';
        this.gameLayout.style.height = levelController.blocks.length * BLOCK_HEIGHT + 'px';

    }

    init() {
        let self = this;
        this.levelController.blocks.forEach( (controllerLine, lineIndex) => {
            controllerLine.forEach( (controllerBlock, blockIndex) => {
                //расставляем блоки
                switch (controllerBlock.type) {
                    case 'brick':
                        new Brick({
                            left: BLOCK_WIDTH * blockIndex,
                            top: BLOCK_HEIGHT * lineIndex,
                            theme: self.theme,
                            parentNode: self.gameLayout,
                            gameView: self,
                        });
                        break;
                    case 'start':
                        new Gate({
                            left: BLOCK_WIDTH * (blockIndex - 1),
                            top: BLOCK_HEIGHT * (lineIndex - 3),
                            theme: self.theme,
                            parentNode: self.gameLayout,
                            gameView: self,
                        });
                        break;
                    case 'finish':
                        new Gate({
                            left: BLOCK_WIDTH * (blockIndex - 1),
                            top: BLOCK_HEIGHT * (lineIndex - 3),
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
            this.cameraFrame.left = Math.min( -leftPosition, CAMERA_PADDING_X);
        }

    }

    updateCameraPositionY() {
        if (!this.isHeightEnouch) {

            // проверяем нужно ли двигать камеру наверх
            if (this.cameraFrame.top + this.hero.bounds.top < CAMERA_PADDING_Y) {

                // если выпал за край уровня можно немного полететь еще
                if (this.hero.isOutOfLevelTop()) {
                    this.cameraFrame.top = Math.min( CAMERA_PADDING_Y - this.hero.bounds.top, this.cameraFrame.fellTreshhold);
                    return;
                }

                // если не падаем, то двигаем камеру 
                this.cameraFrame.top = CAMERA_PADDING_Y - this.hero.bounds.top;
            }
            
            // проверяем нужно ли двигать камеру вниз
            if (this.cameraFrame.height - this.cameraFrame.top - this.hero.bounds.bottom < CAMERA_PADDING_Y) {
                if (this.hero.isOutOfLevelBottom()) {
                    this.cameraFrame.top = Math.max(
                        - (this.levelController.contentHeight + this.cameraFrame.fellTreshhold - this.cameraFrame.height),
                        this.cameraFrame.height - CAMERA_PADDING_Y - this.hero.bounds.bottom
                    );
                    return;
                }
                this.cameraFrame.top = this.cameraFrame.height - CAMERA_PADDING_Y - this.hero.bounds.bottom;
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
