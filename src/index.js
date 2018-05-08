'use strict';

import level from './levels/level01.js';
import LevelController from "./level_controller.js";
import * as Utils from './utils.js';
import GameView from './game_view.js';
import Hero from "./components/hero.js";

let levelController = new LevelController(level);
let gameView = new GameView(levelController);
let hero = new Hero(gameView);

window.onresize = () => {
    gameView.updateScreenSize();
}

document.onscroll = (e) => {
    e.preventDefault();
}

levelController.start();
