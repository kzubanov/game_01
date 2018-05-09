'use strict';

import GameAnimatedComponent from './game_animated_component.js';
import CONSTANTS from '../constants.js';
import * as Utils from '../utils.js';

// потом будут другие анимированные персонажи, 
// добавим еще класс и вынесем большинство методов туда.
// а пока и так сойдет

//но инициализацию стейтов нужно вынести в GameAnimatedComponent !!! а то криво
export default class Hero extends GameAnimatedComponent {
    
    constructor(gameView) {
        
        //здесь специфичные для hero значения. потом перепишу
        super({
            width: CONSTANTS.HERO_WIDTH,
            height: CONSTANTS.HERO_HEIGHT,
            paddingLeft: CONSTANTS.HERO_PADDING_X,
            paddingRight: CONSTANTS.HERO_PADDING_X,
            paddingTop: CONSTANTS.HERO_PADDING_Y,
            paddingBottom: CONSTANTS.HERO_PADDING_Y,
            backgroundImage: 'hero.png',
            gameView: gameView,
            left: gameView.levelController.startPosition.x * CONSTANTS.BLOCK_WIDTH,
            top: gameView.levelController.startPosition.y * CONSTANTS.BLOCK_HEIGHT,

        });

        gameView.hero = this;
        this.levelController = this.gameView.levelController;
        this.isJumpLocked = false;
        this.isJumpStart = true;
        this.orientationIsNormal = this.levelController.startFromBottom;
        this.jumpDirectionTop = ! this.levelController.startFromBottom;
        this.nearestBorders = {};

        // стейты — потом вынесу инициализацию стейтов в GameAnimatedComponent
        // и буду засовывать в options асайном
        this.states.jumpTop = Utils.makeFrames(0, [5, 6], 1, this);
        this.states.jumpBottom = Utils.makeFrames(1, [5, 6], 1, this);
        this.states.fellTop = Utils.makeFrames(0, [7, 8, 6], 2, this);
        this.states.fellBottom = Utils.makeFrames(1, [7, 8, 6], 2, this);
        this.states.top = Utils.makeFrames(1, [0, 0, 1, 1], 0, this);
        this.states.default = Utils.makeFrames(0, [0, 0, 1, 1], 0, this);
        this.states.afterJumpTop = Utils.makeFrames(1, [4, 3, 2, 0, 0, 1, 1], 3, this);
        this.states.afterJumpBottom = Utils.makeFrames(0, [4, 3, 2, 0, 0, 1, 1], 3, this);

        // перетераем заданное в конструкторе. пока так, потом код выше будет вынесен и все станет ок
        this.currentState = this.states.default;
        this.currentFrame = this.currentState.defaultFrame;
        
        // контроллер уровня должен знать персонажа
        this.levelController.hero = this;

        let self = this;
        this.callHeroJump = function() {
            self.jumpStart.call(self);
        }
    }

    //первый фрэйм прыжка подготовительный, персонаж тянется наверх. со 2го уже прыгаем
    speedY() {
        if (this.isJumpStart) {
            return 0;
        }
        return 40;
    }

    //двигаем объект, рендерим фрэйм, двигаем фрэйм дальше. потом перенесем часть этих действий
    render() {
        this.node.style.left =  this.bounds.left - this.paddingLeft + 'px';
        this.node.style.top =  this.bounds.top - this.paddingTop + 'px';      
        this.renderFrame();
        this.nextFrame();
    }

    // чтобы понимать когда мы врезаемся нам нужны границы, а не координаты x, y. 
    // основные left / top, тк из них строится позиционирование. остальные выводим из них и размера
    refreshBounds() {
        this.bounds.bottom = this.bounds.top + this.height;
        this.bounds.right = this.bounds.left + this.width;
        this.nearestBorders = this.levelController.getNearestBorders(this.bounds);
    }

    // метод смещения за следующий рендер сцены. здесь все проверки на столкновения 
    // проверки на выходы за границы уровня и тд
    move() {

        // здесь мы делаем проверки что произойдет после следующего смещения
        // сначала по x, потом по y (чтобы отлавливать кейсы 
        // когда персонажвылетает за границы, но при этом цепляет край)
        let speedY = this.speedY();

        // проверки есть ли стена справа 
        if ( this.isRunRightHasBarier() ) {
            this.bounds.left = this.nearestBorders.right - this.width;
            alert('удар справа');
            this.levelController.stop();
            return;
        }

        //двигаемся вправо
        this.bounds.left += this.levelController.speedX(this.bounds.left);
        this.refreshBounds();

        // проверяем не дошли ли до старта?
        if (this.isItFinish()) {
            alert('finish!');
            this.levelController.stop();
            return;
        }
        

        // проверяем не свалилваемся ли мы вниз?
        if ( ( ! this.isJumpBottom() ) && ( ! this.isJumpTop() ) ) {
            if (this.orientationIsNormal && this.bounds.bottom !== this.nearestBorders.bottom) {
                this.fellStart();
            }
            if ( ! this.orientationIsNormal && this.bounds.top !== this.nearestBorders.top) {
                this.fellStart();
            }
        }

        // теперь смотрим что по вертикали

        if ( this.isJumpTop() ) {
            if ( this.isJumpTopHasBarier() ) {
                this.bounds.top = this.nearestBorders.top;
                this.jumpStop();
            } else {
                this.bounds.top -= speedY;
                this.isJumpStart = false;
            }

            if ( this.isOutOfLevelTop() ) {
                if (this.bounds.top <= - this.gameView.cameraFrame.fellTreshhold) {
                    this.bounds.top = - this.gameView.cameraFrame.fellTreshhold;
                    this.refreshBounds();
                    this.render();
                    alert('упали наверх')
                    this.levelController.stop();
                    return;
                }
            }
        }

        if ( this.isJumpBottom() ) {
            if ( this.isJumpBottomHasBarier() ) {
                this.bounds.top = this.nearestBorders.bottom - this.height;
                this.jumpStop();
            } else {
                this.bounds.top += speedY;
                this.isJumpStart = false;
            }

            if ( this.isOutOfLevelBottom() ) {
                if (this.bounds.top >= this.gameView.cameraFrame.fellTreshhold + this.levelController.blocks.length * CONSTANTS.BLOCK_HEIGHT) {
                    this.bounds.top = this.gameView.cameraFrame.fellTreshhold + this.levelController.blocks.length * CONSTANTS.BLOCK_HEIGHT;
                    this.refreshBounds();
                    this.render();
                    alert('упали вниз')
                    this.levelController.stop();
                    return;
                }
            }
        }

        if (this.isItFinish()) {
            alert('finish!');
            this.levelController.stop();
            return;
        }

        this.refreshBounds();
    }

    fellStart() {
        if (this.isJumpLocked) {
            return;
        }
        this.isJumpLocked = true;
        if (this.orientationIsNormal) {
            this.setState('fellBottom');
        } else {
            this.setState('fellTop');
        }
    }

    jumpStart() {

        // мы не можем прыгать в любой момент, мб идет пересчет координат, все может поломаться
        // поэтому прыжок по подписке на эвернт
        // эвент удаляем когда настало время
        this.off('readyForAction', this.jumpStart);
        // document.removeEventListener('readyForAction', this.callHeroJump);
        if (this.isJumpLocked) {
            return;
        }
        this.isJumpLocked = true;
        this.orientationIsNormal = ! this.orientationIsNormal;
        if (this.orientationIsNormal) {
            this.setState('jumpBottom');
        } else {
            this.setState('jumpTop');
        }
    }

    jumpStop() {
        this.isJumpLocked = false;
        if (this.orientationIsNormal) {
            this.setState('afterJumpBottom');
        } else {
            this.setState('afterJumpTop');
        }
        this.isJumpStart = true;
    }


    // на разной скорости разная анимация движения
    // потом будем использовать
    getStateFromSppedX(afterJumpDirection = '') {
        if (afterJumpDirection === '') {

        }
    }




    // ————————————  Методы для проверок выхода за границы / пересечений и тд  ————————————
    // в move было очень много проверок, тяжело масштабировать логику, вынесем все в отдельные методы проверок
    // тестировать можно будет отдельно6, что удобно

    isItFinish() {
        let block = this.levelController.getBlockFromPoint({
            x: this.bounds.left + this.width / 2,
            y: this.bounds.top + this.height / 2,
        }, this.levelController);

        if (block.type === 'finish') {
            return true;
        }

        // у ворот финиша попадание в 2 блока можно считать финишем. посмотрим лок выше
        block = this.levelController.getBlockFromPoint({
            x: this.bounds.left + this.width / 2,
            y: this.bounds.top + this.height / 2 - CONSTANTS.BLOCK_HEIGHT,
        }, this.levelController);

        if (block.type === 'finish') {
            return true;
        }

        // если дошли, до сюда, то не финиш
        return false;

    }

    displaceToBounds(bounds) {
        this.style.top = (bounds.top - CONSTANTS.HERO_PADDING_Y) + 'px';
        this.style.left = (bounds.left - CONSTANTS.HERO_PADDING_X) + 'px';
    }

    isJumpTop() {
        return this.isJumpLocked === true && ! this.orientationIsNormal;
    }

    isJumpBottom() {
        return this.isJumpLocked === true && this.orientationIsNormal;
    }

    isJumpTopHasBarier() {
        if (this.nearestBorders.top !== null) {
            if (this.bounds.top - this.speedY() <= this.nearestBorders.top ) {
                    return true;
            }
        }
        return false;
    }

    isJumpBottomHasBarier() {
        if (this.nearestBorders.bottom !== null) {
            if (this.bounds.bottom + this.speedY() >= this.nearestBorders.bottom ) {
                    return true;
            }
        }
        return false;
    }

    isRunRightHasBarier() {
        if (this.nearestBorders.right !== null) {
            if (this.bounds.right + this.levelController.speedX(this.bounds.left) >= this.nearestBorders.right) {
                return true;
            }
        }
        return false;
    }

    isOutOfLevelTop() {
        if (this.bounds.top <= 0) {
            return true;
        }
        return false;
    }

    isOutOfLevelBottom() {
        if ( this.bounds.bottom >= this.levelController.blocks.length * CONSTANTS.BLOCK_HEIGHT ) {
            return true;
        }
        return false;
    }

    isOutOfLevelRight() {
        if ( this.bounds.right >= (this.levelController.blocks[0].length + 0.5) * CONSTANTS.BLOCK_WIDTH ) {
            return true;
        }
        return false;
    }
}