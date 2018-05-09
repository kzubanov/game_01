'use strict';


// примесь для событий на элементах
// взял из учебника и переписал, чтобы работало с обычными ивентами, а не тольк остроками, мб потом пригодится
// + переписал на новый сандарт
let eventMixin = {

    /**
     * Подписка на событие
     * Использование:
     *  menu.on('select', function(item) { ... }
     */
    on: function(eventName, handler) {
        if (!this._eventHandlers) this._eventHandlers = {};
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = [];
        }
        this._eventHandlers[eventName].push(handler);
    },
  
    /**
     * Прекращение подписки
     *  menu.off('select',  handler)
     */
    off: function(eventName, handler) {
        if ( !this._eventHandlers || !this._eventHandlers[eventName]) {
            return;
        }
        //let handlers = this._eventHandlers && this._eventHandlers[eventName];
        //if (!handlers) return;

        this._eventHandlers[eventName].forEach((element, index, array) => {
            if (element === handler) array.splice(index - 1, 1);
        });
    },
  
    /**
     * Генерация события с передачей данных
     *  this.trigger('select', item);
     */
    trigger: function(event /*, ... */) {
  
        if (!this._eventHandlers || !this._eventHandlers[event.type]) {
            return; // обработчиков для события нет
        }
  
        // вызвать обработчики
        let handlers = this._eventHandlers[event.type];
        handlers.forEach(element => {
            element.apply( this, [...arguments].slice(1) )
        });
    }
};


export default eventMixin;