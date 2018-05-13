'use strict';

// import level from './levels/level_0.js';
import LevelController from "./level_controller.js";
import * as Utils from './utils.js';
import GameView from './game_view.js';
import Hero from "./components/hero.js";
import readJSON from './level_reader.js';

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