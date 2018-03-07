(function() {

    let jumpers = {};

    let isFunction = function (functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }

    let action = function (jumper) {
        let target = jumper.el;
        if (jumper.value && jumper.value !== '') {
            if (jumpers[jumper.value]) {
                target = jumpers[jumper.value].el;
            }
        }
        if (!jumper.arrowFlag) {
            if (jumper.modifiers.blur) {
                jumper.el.blur();
            }
            if (isFunction(target[jumper.arg])) {
                target[jumper.arg]();
            }
        }
        if (jumper.arrowFlag !== undefined) {
            jumper.arrowFlag = false;
        }
    }

    let callAction = function (elementName) {
        if (jumpers[elementName]) {
            action(jumpers[elementName]);
        } else {
            console.error('Vue-Jumper: The id provided as an argument does not correspond to any element.');
        }
    }
    
    let keyHandler = function (event) {
        if ((event.type.toUpperCase() === 'KEYUP' && event.key.toUpperCase() === 'ENTER') || event.type.toUpperCase() === 'CLICK' || event.type.toUpperCase() === 'CHANGE') {
            action(jumpers[this.id]);
        }
    };
    
    let checkArrows = function (event) {
        if (event.type.toUpperCase() === 'CLICK' || event.key.toUpperCase() === 'ARROWRIGHT' || event.key.toUpperCase() === 'ARROWLEFT' || event.key.toUpperCase() === 'ARROWUP' || event.key.toUpperCase() === 'ARROWDOWN') {
            jumpers[this.id].arrowFlag = true;
        }
    };

    let addElementToArray = function (el, binding, node) {
        jumpers[el.id] = {};
        jumpers[el.id].name = el.id;
        jumpers[el.id].value = binding.value;
        jumpers[el.id].arg = binding.arg;
        jumpers[el.id].el = el;
        jumpers[el.id].modifiers = binding.modifiers;
        if (el.tagName.toUpperCase() === 'DIV' || el.tagName.toUpperCase() === 'SPAN') {
            let searchInput = el.querySelector('input');
            if (searchInput) {
                jumpers[el.id].el = searchInput;
            } else {
                let searchTextArea = el.querySelector('textarea');
                if (searchTextArea) {
                    jumpers[el.id].el = searchTextArea;
                } else {
                    let searchButton = el.querySelector('button');
                    if (searchButton) {
                        jumpers[el.id].el = searchButton;
                    }
                }
            }
        }
        if (!binding.modifiers.wait) {
            el.addEventListener('keyup', keyHandler, false);
            if (el.tagName.toUpperCase() === 'BUTTON') {
                el.addEventListener('click', keyHandler, false);
            }
            if (el.tagName.toUpperCase() === 'SELECT') {
                el.addEventListener('change', keyHandler, false);
                el.addEventListener('keydown', checkArrows, false);
                el.addEventListener('click', checkArrows, false);
                jumpers[el.id].arrowFlag = false;
            }
        }
    }

    let jumper = {
        bind: function (el, binding, node) {
            if (!node.context.$jump) {
                node.context.$jump = callAction;
            }
            addElementToArray(el, binding, node);
        },
        inserted: function (el, binding, node) {
            if (!jumpers[el.id]) {
                addElementToArray(el, binding, node);
            }
        },
        unbind: function (el, binding, node) {
            el.removeEventListener('keyup', keyHandler, false);
            if (el.tagName === 'button') {
                el.removeEventListener('click', keyHandler, false);
            }
            jumpers[el.id] = undefined;
        }
    };
    
    try {
        module.exports = jumper;
    } catch (e) {
        // no worries, our directive will just be registered in browser
    }
})();    