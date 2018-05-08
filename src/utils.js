'use strict';

// нам нужно иметь возможность делать зацикленные анимации. 
// но иногда нужно начать с других кадров
// например когда показываем анимацию бега после приземления
// по-хорошему нужно планировать состояние после приземления и состояние бега после него
// но пока запилено так. так проще

// чтобы не делать кучу ненужных оппераций
// генерируем односвязный зацикленный список в котором хранится готовое свойство background-position 
// это нужно чтобы сразу двигать спрайт стилем без вычеслений
// в loopFrame индекс xFrames на который мы переходим после последнего
export function makeFrames(y, xFrames, loopFrame, context) {
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


// смотрим к каким строкам / столбцам относятся разные границы эдемента
// например hero может быть в 1 и 2 строках одновременно и столкновения могут быть и там и там
export function getLinesFromBounds(bounds) {

    let bottom = Math.ceil(bounds.bottom / BLOCK_HEIGHT - 1);
    let top;

    if (bounds.top % BLOCK_HEIGHT === 0) {
        top = Math.ceil(bounds.top / BLOCK_HEIGHT);
    } else {
        top = Math.ceil(bounds.top / BLOCK_HEIGHT - 1);
    }

    return {top, bottom};
}

export function getColumnsFromBounds(bounds) {

    let left;
    let right = Math.ceil(bounds.right / BLOCK_WIDTH - 1);

    if (bounds.left % BLOCK_WIDTH === 0) {
        left = Math.ceil(bounds.left / BLOCK_WIDTH);
    } else {
        left = Math.ceil(bounds.left / BLOCK_WIDTH - 1);
    }

    return {left, right};
}


// часто приходится одно временно (почти) что-то делать
// для этого в globalStack будем хранить массивы ссылок на такие объекты
// аэтой функцией потом вызывать их методы по ключу
/*
уже не надо, потом мб раскоментим
export function callFunctionByKey(objects, funcKey, args) {
    objects.forEach(object => {
        object[funcKey](args);
    });
}
*/

// для показа рандомной картинки спрайта нужен целочисленный рандом
export function random(num) {
    return Math.round ( num * Math.random() )
}

// проверка на то, что персонаж может передвигаться по блоку данного типа
export function isBlock(elem) {
    let blockTypes = ['brick'];
    return blockTypes.indexOf(elem.type) > -1;
}

// ускорения/замедления лучше делать с нелинейной скоростью
// пока интерполятор линейный, но потом поменяем
export function speedInterpolator(x) {
    return x;
}