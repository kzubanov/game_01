'use strict';



// все что рисуем на канвасе
class GameComponent {
    
    constructor(options) {

        this.node = document.createElement('div');
        this.node.classList.add('game_element');

        // у некоторых элементов есть поля, котрые не нужны для рассчетов, но нужны для графики
        // ширина / высота с которыми мы далее опперируем — рассчетные
        // реальные размеры дива равны этой ширине / высоте + паддинги
        this.paddingLeft = options.paddingLeft || 0;
        this.paddingRight = options.paddingRight || 0;
        this.paddingTop = options.paddingTop || 0;
        this.paddingBottom = options.paddingBottom || 0;
        this.width = options.width || 0;
        this.height = options.height || 0;

        if (options.backgroundImage) {
            this.node.style.backgroundImage = 'url(src/images/' + levelController.theme + '/' + options.backgroundImage + ')';
        }

        this.bounds = {
            top: options.top,
            left: options.left,
            bottom: options.top + this.height,
            right: options.left + this.width,
        };

        this.node.style.top = this.bounds.top - this.paddingTop + 'px';
        this.node.style.left = this.bounds.left - this.paddingLeft + 'px';
        this.node.style.width = this.width + this.paddingLeft + this.paddingRight + 'px';
        this.node.style.height = this.height + this.paddingTop + this.paddingBottom + 'px';
        
        this.type = options.type || 'empty';

        // многие объккты выглядят скучно когда повторяются в точности
        // поэтому на них мы повесим спрайт текстурой и будем выводить рандомную картинку
        if (options.randomImage) {
            let spriteLength = options.spriteLength || 0;
            let realWidth = this.width + this.paddingLeft + this.paddingRight;
            this.node.style.backgroundPositionX = ( - realWidth * random(spriteLength - 1) ) + 'px';
        }

        globalStack.initObjects.push(this);
    }
    
    init() {
        gameLayout.append(this.node);
    }

    // нужно будет когда будем рендерить уровень кусками 
    // уровень может быть большим, нечего перерисовывать кучу графики
    destroy() {
        
    }
    
}




// все что умеет менять свою графику (двигать спрайт стилем)
class GameAnimatedComponent extends GameComponent {
    
    constructor(options) {
        
        super(options);

        //потом будем в конструкторе собирать стейты
        this.states = {
            default: {},
        };
        this.currentState = this.states.default;
        this.currentFrame = this.currentState.defaultFrame;

        globalStack.animatedObjects.push(this);
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
}