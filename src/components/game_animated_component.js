'use strict';

import GameComponent from './game_component.js';
import eventMixin from './../event_mixin.js'
import gameEvents from './../game_events.js'

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
        this.node.model = this;
        let self = this;
        
        this.on('render', this.render);
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

for(let key in eventMixin) {
    GameAnimatedComponent.prototype[key] = eventMixin[key];
}
