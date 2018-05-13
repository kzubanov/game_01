'use strict';

import * as Utils from './../utils/utils.js';
import eventMixin from './../events/event_mixin.js';
import gameEvents from './../events/game_events.js';


// все что рисуем на канвасе
export default class GameComponent {
    
    constructor(options) {

        this.gameView = options.gameView;

        // у некоторых элементов есть поля, котрые не нужны для рассчетов, но нужны для графики
        // ширина / высота с которыми мы далее опперируем — рассчетные
        // реальные размеры дива равны этой ширине / высоте + паддинги
        this.paddingLeft = options.paddingLeft || 0;
        this.paddingRight = options.paddingRight || 0;
        this.paddingTop = options.paddingTop || 0;
        this.paddingBottom = options.paddingBottom || 0;
        this.width = options.width || 0;
        this.height = options.height || 0;

        this.bounds = {
            top: options.top,
            left: options.left,
            bottom: options.top + this.height,
            right: options.left + this.width,
        };

        this.randomImage = options.randomImage || false;
        this.type = options.type || 'empty';
        this.backgroundImage = options.backgroundImage || null;
        this.spriteLength  = options.spriteLength || 1;

        // многие объккты выглядят скучно когда повторяются в точности
        // поэтому на них мы повесим спрайт текстурой и будем выводить рандомную картинку

        options.gameView.componentStack.initObjects.push(this);
        this.on('init', this.init);
        this.on('render', this.render);
    }
    
    init() {
        this.node = document.createElement('div');
        this.node.classList.add('game_element');
        if (this.backgroundImage) {
            this.node.style.backgroundImage = 'url(src/images/' + this.gameView.theme + '/' + this.backgroundImage + ')';
        }
        this.node.style.top = this.bounds.top - this.paddingTop + 'px';
        this.node.style.left = this.bounds.left - this.paddingLeft + 'px';
        this.node.style.width = this.width + this.paddingLeft + this.paddingRight + 'px';
        this.node.style.height = this.height + this.paddingTop + this.paddingBottom + 'px';

        if (this.randomImage) {
            let spriteLength = this.spriteLength || 0;
            let realWidth = this.width + this.paddingLeft + this.paddingRight;
            this.node.style.backgroundPositionX = ( - realWidth * Utils.random(spriteLength - 1) ) + 'px';
        }

        this.gameView.gameLayout.append(this.node);
        
    }

    // нужно будет когда будем рендерить уровень кусками 
    // уровень может быть большим, нечего перерисовывать кучу графики
    destroy() {
        
    }
    
}

for(let key in eventMixin) {
    GameComponent.prototype[key] = eventMixin[key];
}