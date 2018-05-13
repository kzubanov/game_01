'use strict';

import * as Utils from './../utils/utils.js';
import CONSTANTS from './../utils/constants.js';
import gameEvents from './../events/game_events.js';

// здесь будут баныые о блоках и методы для вычесления ближайших, запуска и тд

export default class LevelController {
    
    constructor(level, options) {

        // добавим когда создадим
        this.hero;
        this.gameView;
        
        // из блоков собираем уровень
        this.blocks = [];

        //на разных уровнях будет разная графика
        this.theme = level.theme;

        // скорость будет периодически нелинейно увеличиваться за уровень
        this.speedPlan = Array.from(level.speedPlan);

        // нужно для рассчета скорости — текущий скорочтной интервал
        this.currentSpeedIntervalNum = 0;

        let self = this;

        // нужно пометить блоки по которым можно бегать
        // раз уж бежим по всем элементам заодно найдем начальную точку
        Array.from(level.blocks).forEach( (line, lineIndex) => {
            self.blocks[lineIndex] = [];
            Array.from(line).forEach( (elem, elemIndex) => {
                //копируем тип
                self.blocks[lineIndex][elemIndex] = {type: elem.type};

                // у некоторых типов блоков есть атрибут is_block, ставим его сразу, чтобы потом не пересчитывать что блок, а что нет
                if (Utils.isBlock(elem)) {
                    self.blocks[lineIndex][elemIndex].is_block = true;
                } else {
                    self.blocks[lineIndex][elemIndex].is_block = false;
                }

                // ищим старт
                if (elem.type === 'start') {
                    self.startPosition = {
                        x: elemIndex,
                        y: lineIndex,
                    };
                }
            } )
        } );

        // нам нужно знать стартуем нормально или кверх ногами
        if ( this.blocks[this.startPosition.y + 1] && this.blocks[this.startPosition.y + 1][this.startPosition.x].is_block ) {
            this.startFromBottom = true;
        } else {
            this.startFromBottom = false;
        }

        // часто для рассчетов нужен размер контента
        this.contentWidth = this.blocks[0].length * CONSTANTS.BLOCK_WIDTH;
        this.contentHeight = this.blocks.length * CONSTANTS.BLOCK_HEIGHT;

    }

    // скорость движения определяется уровнем.
    // в пределах уровня скорость меняется
    // но скорось прыжка это параметр hero, от уровня не зависит, поэтому speedY там
    speedX(positionX) {

        //debugger;


        //если вышли заграницы или это последний интервал

        if (this.currentSpeedIntervalNum >= this.speedPlan.length - 1) {
            return this.speedPlan[this.speedPlan.length-1].speed;
        }
        
        
        //остальные кейсы
        let currentInterval = this.speedPlan[this.currentSpeedIntervalNum];
        if (
            positionX >= currentInterval.start &&
            positionX <= currentInterval.finish
        ) {
            // если нет ускорения
            if (!currentInterval.speedBoost) {
                return currentInterval.speed;
            }
            
            //если есть ускорение
            let lastInterval = this.speedPlan[this.currentSpeedIntervalNum - 1];
            let positionProgress = (positionX - currentInterval.start) / (currentInterval.finish - currentInterval.start)
            return Math.round( lastInterval.speed +  Utils.speedInterpolator(positionProgress) * (currentInterval.speed - lastInterval.speed) );
        }

        // если не попали в интервал, то просто идем к следующему
        this.currentSpeedIntervalNum++;
        return this.speedX(positionX);

    }

    getBlockFromPoint(point) {
        let x = Math.ceil(point.x / CONSTANTS.BLOCK_WIDTH - 1);
        let y = Math.ceil(point.y / CONSTANTS.BLOCK_HEIGHT - 1);
    
        if (x < 0) {
            return {};
        }
        
        if (x > this.blocks[0].length - 1) {
            return {};
        }
    
        if (y < 0) {
            return {};
        }
    
        if (y > this.blocks.length - 1) {
            return {};
        }
    
        return this.blocks[y][x];
    }

    getNearestBorders(bounds) {
        let nextBlockTop = null;
        let nextBlockBottom = null;
        let nextBlockRight = null;

        let lines = Utils.getLinesFromBounds(bounds);
        let columns = Utils.getColumnsFromBounds(bounds);

        if (columns.right > this.blocks[0].length - 1) {
            return {top: null, bottom: null, right: null};
        }

        if (lines.top < 0) {
            return {top: null, bottom: null, right: null};
        }

        if (lines.bottom > this.blocks.length - 1) {
            return {top: null, bottom: null, right: null};
        }

    
        // ищем ближайшие стены
        for (let i = columns.right; i < this.blocks[0].length; i++) {
            if ( this.blocks[lines.top][i].is_block || this.blocks[lines.bottom][i].is_block) {
                nextBlockRight = i * CONSTANTS.BLOCK_WIDTH;
                break;
            }
        }
        for (let i = lines.bottom; i < this.blocks.length; i++) {
            if ( this.blocks[i][columns.right].is_block || this.blocks[i][columns.left].is_block ) {
                nextBlockBottom = i * CONSTANTS.BLOCK_HEIGHT;
                break;
            }
        }
        for (let i = lines.top; i > -1; i--) {
            if ( this.blocks[i][columns.left].is_block || this.blocks[i][columns.right].is_block ) {
                nextBlockTop = (i + 1) * CONSTANTS.BLOCK_HEIGHT;
                break;
            }
        }

        //возвращаем ближайшие стены ил null'ы
        return {
            top: nextBlockTop,
            bottom: nextBlockBottom,
            right: nextBlockRight
        };
    }

    start() {
        this.timerId = setInterval( () => {
            this.hero.trigger(gameEvents.readyForAction);
            this.hero.move();
            this.gameView.render();
        }, CONSTANTS.TICK);

        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 32) {
                e.preventDefault();
                // debugger;
                this.hero.on('readyForAction', this.hero.jumpStart);
            };
        });
    }

    stop() {
        clearInterval(this.timerId);
    }

}