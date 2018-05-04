'use strict';

// здесь будут баныые о блоках и методы для вычесления ближайших, запуска и тд

let levelController = {
    
    startPosition: level.startPosition,
    startFromBottom: level.startFromBottom,
    blocks: level.blocks,
    speed: level.speedX,
    theme: level.theme,

    // скорость бвижения определяется уровнем.
    // но скорось прыжка это параметр hero, поэтому она там
    speedX() {
        return this.speed;
    },

    getNearestBorders(bounds) {

        let nextBlockTop = null;
        let nextBlockBottom = null;
        let nextBlockRight = null;

        let lines = getLinesFromBounds(bounds);
        let columns = getColumnsFromBounds(bounds);

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
                nextBlockRight = i * BLOCK_WIDTH;
                break;
            }
        }
        for (let i = lines.bottom; i < this.blocks.length; i++) {
            if ( this.blocks[i][columns.right].is_block || this.blocks[i][columns.left].is_block ) {
                nextBlockBottom = i * BLOCK_HEIGHT;
                break;
            }
        }
        for (let i = lines.top; i > -1; i--) {
            if ( this.blocks[i][columns.left].is_block || this.blocks[i][columns.right].is_block ) {
                nextBlockTop = (i + 1) * BLOCK_HEIGHT;
                break;
            }
        }

        //возвращаем ближайшие стены ил null'ы
        return {
            top: nextBlockTop,
            bottom: nextBlockBottom,
            right: nextBlockRight
        };
    },

    start() {
        this.timerId = setInterval( () => {
            document.dispatchEvent(readyForAction);
            hero.move();
            //hero.render();
            callFunctionByKey(globalStack.animatedObjects, 'render', {});
        }, TICK);
    },

    stop() {
        clearInterval(this.timerId);
    },

    finish() {

    },

    dead() {

    }
    
}