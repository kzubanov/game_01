'use strict';

import CONSTANTS from './constants.js';


// смотрим к каким строкам / столбцам относятся разные границы эдемента
// например hero может быть в 1 и 2 строках одновременно и столкновения могут быть и там и там
export function getLinesFromBounds(bounds) {

    let bottom = Math.ceil(bounds.bottom / CONSTANTS.BLOCK_HEIGHT - 1);
    let top;

    if (bounds.top % CONSTANTS.BLOCK_HEIGHT === 0) {
        top = Math.ceil(bounds.top / CONSTANTS.BLOCK_HEIGHT);
    } else {
        top = Math.ceil(bounds.top / CONSTANTS.BLOCK_HEIGHT - 1);
    }

    return {top, bottom};
}

export function getColumnsFromBounds(bounds) {

    let left;
    let right = Math.ceil(bounds.right / CONSTANTS.BLOCK_WIDTH - 1);

    if (bounds.left % CONSTANTS.BLOCK_WIDTH === 0) {
        left = Math.ceil(bounds.left / CONSTANTS.BLOCK_WIDTH);
    } else {
        left = Math.ceil(bounds.left / CONSTANTS.BLOCK_WIDTH - 1);
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