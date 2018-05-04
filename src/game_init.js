'use strict';


let hero = new Hero({
    left: levelController.startPosition.x * BLOCK_WIDTH,
    top: levelController.startPosition.y * BLOCK_HEIGHT,
});

callFunctionByKey(globalStack.initObjects, 'init', {});


// для передачи в эвент листсенер
function callJump() {
    hero.jumpStart();
}

gameLayout.style.width = levelController.blocks[0].length * BLOCK_WIDTH + 'px';
gameLayout.style.height = levelController.blocks.length * BLOCK_HEIGHT + 'px';

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
        e.preventDefault();
        document.addEventListener('readyForAction', callJump);
    };
});

levelController.start();