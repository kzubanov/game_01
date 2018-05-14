'use strict';

import GameComponent from './game_component.js';
import gameEvents from './../events/game_events.js';

// все что умеет менять свою графику (двигать спрайт стилем)
export default class GameAnimatedComponent extends GameComponent {
    
    constructor(options) {
        
        super(options);

        //потом будем в конструкторе собирать стейты
        
        options.gameView.componentStack.animatedObjects.push(this);
        let self = this;
        

        this.states = {};
        for (let key in options.states) {
            this.states[key] = this.makeFrames(options.states[key]);
            this.states[key].name = key;
        }

        this.currentState = this.states.default;
        this.currentFrame = this.currentState.defaultFrame;
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

    getStateName() {
        return this.currentState.name;
    }

    render() {
        this.renderFrame();
        this.nextFrame();
    }

    // нам нужно иметь возможность делать зацикленные анимации. 
    // но иногда нужно начать с других кадров
    // например когда показываем анимацию бега после приземления
    // по-хорошему нужно планировать состояние после приземления и состояние бега после него
    // но пока запилено так. так проще

    // чтобы не делать кучу ненужных оппераций
    // генерируем односвязный зацикленный список в котором хранится готовое свойство background-position 
    // это нужно чтобы сразу двигать спрайт стилем без вычеслений
    // в loopFrame индекс xFrames на который мы переходим после последнего
    makeFrames(options) {
        let result = {};
        let prevObject;
        let loopObject;
        let realWidth = this.width + this.paddingLeft + this.paddingRight;
        let realHeight = this.height + this.paddingBottom + this.paddingTop;
        options.xFrames.forEach((element, index, array) => {
            let object = {value: (- element * realWidth) + 'px ' + (- options.y * realHeight) + 'px'};
            if (index === options.loopFrame) {
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
}