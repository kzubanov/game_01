'use strict';


// примесь для событий на элементах
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
        let handlers = this._eventHandlers && this._eventHandlers[eventName];
        if (!handlers) return;

        handlers.forEach(element => {
            if (element === handler) handlers.splice(i--, 1);
        });
    },
  
    /**
     * Генерация события с передачей данных
     *  this.trigger('select', item);
     */
    trigger: function(eventName /*, ... */) {
  
        if (!this._eventHandlers || !this._eventHandlers[eventName]) {
            return; // обработчиков для события нет
        }
  
        // вызвать обработчики
        let handlers = this._eventHandlers[eventName];
        handlers.forEach(element => {
            element.apply( this, [...arguments].slice(1) )
        });
    }
};

export default eventMixin;