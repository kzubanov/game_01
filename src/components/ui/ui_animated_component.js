'use strict';

import GameAnimatedComponent from './../game_animated_component.js';

export default class UIAnimatedComponent {
    constructor(options) {

        this.width = options.width || 0;
        this.height = options.height || 0;

        this.on('focuse', this.onFocuse);
        this.on('unFocuse', this.onUnFocuse);
    }

    onFocuse() {
        if (this.getStateName() !== 'focuse') {
            this.setState('focuse');
        }        
    }

    onUnFocuse() {
        if (this.getStateName() !== 'default') {
            this.setState('default');
        }
    }

}







