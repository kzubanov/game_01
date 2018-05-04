'use strict';

// все время нужно обновлять кучу элементов
// для этого завели стэк в котором храним ссылки на эти элементы, чтобы потом по всем бегать
let globalStack = {
    initObjects: [],
    animatedObjects: [],
};

// основной лэйаут. потом добавятся другие нужные ноды, сделаю как-то более струтурировано
let gameLayout;


// нам нужно иметь возможность делать зацикленные анимации. 
// но иногда нужно начать с других кадров
// например когда показываем анимацию бега после приземления
// по-хорошему нужно планировать состояние после приземления и состояние бега после него
// но пока запилено так. так проще

// чтобы не делать кучу ненужных оппераций
// генерируем односвязный зацикленный список в котором хранится готовое свойство background-position 
// это нужно чтобы сразу двигать спрайт стилем без вычеслений
// в loopFrame индекс xFrames на который мы переходим после последнего
function makeFrames(y, xFrames, loopFrame, context) {
    let result = {};
    let prevObject;
    let loopObject;
    let realWidth = context.width + context.paddingLeft + context.paddingRight;
    let realHeight = context.height + context.paddingBottom + context.paddingTop;
    xFrames.forEach((element, index, array) => {
        let object = {value: (- element * realWidth) + 'px ' + (- y * realHeight) + 'px'};
        if (index === loopFrame) {
            loopObject = object;
        }
        if (index === 0) {
            prevObject = object;
            result.defaultFrame = object;
            return;
        }
        result['x' + index] = object;
        prevObject.nextFrame = object;
        prevObject = object;
    });
    prevObject.nextFrame = loopObject;
    return result;
}


let readyForAction = new Event('readyForAction');



// смотрим к каким строкам / столбцам относятся разные границы эдемента
// например hero может быть в 1 и 2 строках одновременно и столкновения могут быть и там и там
function getLinesFromBounds(bounds) {

    let bottom = Math.ceil(bounds.bottom / BLOCK_HEIGHT - 1);
    let top;

    if (bounds.top % BLOCK_HEIGHT === 0) {
        top = Math.ceil(bounds.top / BLOCK_HEIGHT);
    } else {
        top = Math.ceil(bounds.top / BLOCK_HEIGHT - 1);
    }

    return {top, bottom};
}

function getColumnsFromBounds(bounds) {

    let left;
    let right = Math.ceil(bounds.right / BLOCK_WIDTH - 1);

    if (bounds.left % BLOCK_WIDTH === 0) {
        left = Math.ceil(bounds.left / BLOCK_WIDTH);
    } else {
        left = Math.ceil(bounds.left / BLOCK_WIDTH - 1);
    }

    return {left, right};
}


function getBlockFromPoint(options) {
    let x = Math.ceil(options.x / BLOCK_WIDTH - 1);
    let y = Math.ceil(options.y / BLOCK_HEIGHT - 1);

    if (x < 0) {
        return {};
    }
    
    if (x > levelController.blocks[0].length - 1) {
        return {};
    }

    if (y < 0) {
        return {};
    }

    if (y > levelController.blocks.length - 1) {
        return {};
    }

    return levelController.blocks[y][x];
}


// часто приходится одно временно (почти) что-то делать
// для этого в globalStack будем хранить массивы ссылок на такие объекты
// аэтой функцией потом вызывать их методы по ключу
function callFunctionByKey(objects, funcKey, args) {
    objects.forEach(object => {
        object[funcKey](args);
    });
}

// для показа рандомной картинки спрайта нужен целочисленный рандом
function random(num) {
    return Math.round ( num * Math.random() )
}