'use strict';


// если потом будут другие анимированные персонажи, 
// то добавим еще класс и вынесем большинство методов туда. поэтому писал на классах. потом проще будет переносить
// а пока и так ок

//но инициализацию стейтов нужно вынести в GameAnimatedComponent !!! а то криво
class Hero extends GameAnimatedComponent {
    
    constructor(options) {
        
        //здесь специфичные для hero значения. потом перепишу
        super( Object.assign(options, {
            width: HERO_WIDTH,
            height: HERO_HEIGHT,
            paddingLeft: HERO_PADDING_X,
            paddingRight: HERO_PADDING_X,
            paddingTop: HERO_PADDING_Y,
            paddingBottom: HERO_PADDING_Y,
            backgroundImage: 'hero.png',

        }));
        
        //чтобы проще ориентироваться в верстке
        this.node.id = 'hero';

        //  здесь много всего, потом упростим
        this.isJumpLocked = false;
        this.isJumpStart = true;
        this.orientationIsNormal = levelController.startFromBottom;
        this.jumpDirectionTop = ! levelController.startFromBottom;
        this.nearestBorders = {};

        // стейты — потом вынесу инициализацию стейтов в GameAnimatedComponent
        // и буду засовывать в options асайном
        this.states.jumpTop = makeFrames(0, [2, 3], 1, this);
        this.states.jumpBottom = makeFrames(1, [2, 3], 1, this);
        this.states.fellTop = makeFrames(0, [2, 3], 1, this);
        this.states.fellBottom = makeFrames(1, [2, 3], 1, this);
        this.states.top = makeFrames(1, [0, 0, 0, 1, 1, 1], 0, this);
        this.states.default = makeFrames(0, [0, 0, 0, 1, 1, 1], 0, this);
        this.states.afterJumpTop = makeFrames(1, [2, 2, 2, 0, 0, 0, 1, 1, 1], 3, this);
        this.states.afterJumpBottom = makeFrames(0, [2, 2, 2, 0, 0, 0, 1, 1, 1], 3, this);
        
        // перетераем заданное в конструкторе. пока так, потом код выше будет вынесен и все станет ок
        this.currentState = this.states.default;
        this.currentFrame = this.currentState.defaultFrame;
    }

    //первый фрэйм прыжка подготовительный, персонаж тянется наверх. со 2го уже прыгаем
    speedY() {
        if (this.isJumpStart) {
            return 0;
        }
        return 30;
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
        this.nearestBorders = levelController.getNearestBorders(this.bounds);
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
            //console.log('удар справа');
            console.log('удар справа');
            levelController.stop();
            return;
        }

        //двигаемся вправо
        this.bounds.left += levelController.speedX();
        this.refreshBounds();

        if ( this.isOutOfLevelRight() ) {
            //console.log('упали направо')
            console.log('упали направо');
            levelController.stop();
            return;
        }

        // проверяем не дошли ли до старта?
        if (this.isItFinish()) {
            alert('finish!');
            levelController.stop();
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
                console.log('падение наверх');
                levelController.stop();
                return;
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
                console.log('падение вниз');
                levelController.stop();
                return;
            }
        }

        if (this.isItFinish()) {
            alert('finish!');
            levelController.stop();
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
        document.removeEventListener('readyForAction', callJump);
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
        let block = getBlockFromPoint({
            x: this.bounds.left + this.width / 2,
            y: this.bounds.top + this.height / 2,
        });

        if (block.type === 'finish') {
            return true;
        }

        // у ворот финиша попадание в 2 блока можно считать финишем. посмотрим лок выше
        block = getBlockFromPoint({
            x: this.bounds.left + this.width / 2,
            y: this.bounds.top + this.height / 2 - BLOCK_HEIGHT,
        });

        if (block.type === 'finish') {
            return true;
        }

        // если дошли, до сюда, то не финиш
        return false;

    }

    displaceToBounds(bounds) {
        this.style.top = (bounds.top - HERO_PADDING_Y) + 'px';
        this.style.left = (bounds.left - HERO_PADDING_X) + 'px';
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
            if (this.bounds.right + levelController.speedX() >= this.nearestBorders.right) {
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
        if ( this.bounds.bottom >= levelController.blocks.length * BLOCK_HEIGHT ) {
            return true;
        }
        return false;
    }

    isOutOfLevelRight() {
        if ( this.bounds.right >= (levelController.blocks[0].length + 0.5) * BLOCK_WIDTH ) {
            return true;
        }
        return false;
    }
}