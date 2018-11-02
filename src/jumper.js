(function() {

    class JumperList {
        constructor () {
            this.list = [];
            this.lastAction = null;
        }
    
        reset () {
            this.list = [];
            this.lastAction = null;
        }
    
        next (jumper) {
            let elementPosition = this.list.findIndex((item) => {
                return item.name === jumper.name;
            });
            if (elementPosition > -1) {
                if (elementPosition + 1 === this.list.length) {
                    return this.lastAction ? this.lastAction : false;
                }
                return this.list[elementPosition + 1];
            }
            return false;
        }
    
        add (jumper) {
            let jumperPosition = this.list.findIndex((item) => {
                return item.name === jumper.name;
            });
            if (jumperPosition === -1) {
                this.list.push(jumper);
            } else {
                this.list[jumperPosition] = jumper;
            }
        }
    
        getByName (name, context) {
            return this.list.find((item) => {
                return item.name === context + name;
            });
        }
    
        removeByName (elementId, context) {
            let jumper = this.getByName(elementId, context);
            if (jumper) {
                this.remove(jumper);
            } else {
                if (this.lastAction && this.lastAction.name === context + elementId) {
                    this.lastAction = null;
                } else {
                    console.error('Not found in list. Check:', jumperList);
                }
            }
        }
    
        remove (jumper) {
            jumper.remove();
            let jumperPosition = this.list.findIndex((item) => {
                return item.name === jumper.name;
            });
            if (jumperPosition !== -1) {
                this.list.splice(jumperPosition, 1);
            }
        }
    }
    
    let isFunction = function (functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    };
    
    class Jumper {
        constructor (el, binding, node, jumperList) {
            this.name = node.context._uid + el.id;
            this.value = binding.value;
            this.arg = binding.arg;
            this.el = el;
            this.modifiers = binding.modifiers;
            this.jumperList = jumperList;
            this.context = node.context._uid;
            if (!binding.modifiers.wait) {
                el.addEventListener('keydown', this.keyHandler.bind(this), false);
                if (el.tagName.toUpperCase() === 'BUTTON') {
                    el.addEventListener('click', this.keyHandler.bind(this), false);
                }
            }
            if (binding.arg && binding.arg === 'last') {
                this.jumperList.lastAction = this;
            } else {
                this.jumperList.add(this);
            }
        }
    
        remove () {
            if (!this.modifiers.wait) {
                this.el.removeEventListener('keydown', this.keyHandler, false);
                if (this.el.tagName.toUpperCase() === 'BUTTON') {
                    this.el.removeEventListener('click', this.keyHandler, false);
                }
            }
        }
    
        keyHandler (event) {
            if ((event.type.toUpperCase() === 'KEYDOWN' && event.key.toUpperCase() === 'ENTER') || event.type.toUpperCase() === 'CLICK' || event.type.toUpperCase() === 'CHANGE') {
                this.do();
            }
        };
    
        do () {
            let target = this.el;
            if (this.value && this.value !== '') {
                let existElement = this.jumperList.getByName(this.value, this.context);
                if (existElement) {
                    target = existElement.el;
                }
            } else { // custom behaviour -> it's when theres's not a value
                if (this.el.tagName.toUpperCase() === 'INPUT' || this.el.tagName.toUpperCase() === 'TEXTAREA') { // Si el elemento es un botón, textarea o un input
                    let next = this.jumperList.next(this);
                    if (next) {
                        if (next.el.tagName.toUpperCase() === 'BUTTON') {
                            this.el.blur();
                            next.el.click();
                        } else {
                            next.el.focus();
                        }
                    };
                }
            }
            if (this.modifiers.blur) {
                this.el.blur();
            }
            if (isFunction(target[this.arg])) {
                target[this.arg]();
            }
        }
    
        get el () {
            return this._el;
        }
    
        set el (element) {
            if (element.tagName.toUpperCase() === 'INPUT' || element.tagName.toUpperCase() === 'TEXTAREA' || element.tagName.toUpperCase() === 'BUTTON') { // Si el elemento es un botón, textarea o un input
                this._el = element;
            } else if (element.tagName.toUpperCase() === 'DIV' || element.tagName.toUpperCase() === 'SPAN') { // Si el elemento es un div o un span busco el primer input en su interior
                let searchInput = element.querySelector('input');
                if (searchInput) {
                    this._el = searchInput;
                } else {
                    let searchTextArea = element.querySelector('textarea');
                    if (searchTextArea) {
                        this._el = searchTextArea;
                    } else {
                        let searchButton = element.querySelector('button');
                        if (searchButton) {
                            this._el = searchButton;
                        }
                    }
                }
            } else { // Si el elemento es un div
                this._el = element;
            }
        }
    }
    
    let callAction = function (context, jumperList) {
        return (elementName) => {
            let jumper = jumperList.getByName(elementName, context);
            if (jumper) {
                jumper.do();
            } else {
                console.error('Vue-Jumper: The id provided as an argument does not correspond to any element.');
            }
        };
    };
    
    let jumperList = new JumperList();
    
    let jumper = {
        bind: function (el, binding, node) {
            if (!node.context.$jump) { // Si no existe en el contexto la función $jump -> la agregamos
                node.context.$jump = callAction(node.context._uid, jumperList);
            }
        },
        inserted: function (el, binding, node) {
            if (binding.value !== true) {
                /* if (jumperList.list.length === 0 && el.focus) {
                    el.focus();
                } */
                new Jumper(el, binding, node, jumperList); // eslint-disable-line no-new
            }
        },
        unbind: function (el, binding, node) {
            if (binding.value !== true) {
                jumperList.removeByName(el.id, node.context._uid);
            }
        }
    };
    
    
    try {
        module.exports = jumper;
    } catch (e) {
        // no worries, our directive will just be registered in browser
    }
})();    