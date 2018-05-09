'use strict';

import GameComponent from './game_component.js';
import gameEvents from './../events/game_events.js';

// все что умеет менять свою графику (двигать спрайт стилем)
export default class GameAnimatedComponent extends GameComponent {
    
    constructor(options) {
        
        super(options);

        //потом будем в конструкторе собирать стейты
        this.states = {
            default: {},
        };
        this.currentState = this.states.default;
        this.currentFrame = this.currentState.defaultFrame;

        options.gameView.componentStack.animatedObjects.push(this);
        let self = this;
    }
    

    nextFrame() {
        this.currentFrame = this.currentFrame.nextFrame;
    }

    renderFrame() {
        this.node.style.backgroundPosition = this.currentFrame.value;
    }
    
    setState(stateKey) {
        this.currentState = this.states[stateKey];
        this.currentFrame = this.currentState.defaultFrame;
    }

    render() {
        this.renderFrame();
        this.nextFrame();
    }
}
