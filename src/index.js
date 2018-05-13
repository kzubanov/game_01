'use strict';

// import level from './levels/level_0.js';
import LevelController from "./components/level_controller.js";
import * as Utils from './utils/utils.js';
import GameView from './components/game/game_view.js';
import Hero from "./components/game/hero.js";
import readJSON from './utils/level_reader.js';

let level = {};
readJSON("./src/levels/level_0.json", function(object){
    level = object;
});

let levelController = new LevelController(level);
let gameView = new GameView(levelController);
gameView.init();

window.onresize = () => {
    gameView.updateScreenSize();
}

document.onscroll = (e) => {
    e.preventDefault();
}

levelController.start();