let jumpers = {};
let keyHandler = function (event) {
    if ((event.type.toUpperCase() === 'KEYUP' && event.key.toUpperCase() === 'ENTER') || event.type.toUpperCase() === 'CLICK' || event.type.toUpperCase() === 'CHANGE') {
        let target = jumpers[this.id].target;
        if (!jumpers[this.id].arrowFlag) {
            if (jumpers[this.id].modifiers.blur) {
                jumpers[this.id].el.blur();
            }
            target[jumpers[this.id].arg]();
        }
        if (jumpers[this.id].arrowFlag !== undefined) {
            jumpers[this.id].arrowFlag = false;
        }
    }
};

let checkArrows = function (event) {
    if (event.type.toUpperCase() === 'CLICK' || event.key.toUpperCase() === 'ARROWRIGHT' || event.key.toUpperCase() === 'ARROWLEFT' || event.key.toUpperCase() === 'ARROWUP' || event.key.toUpperCase() === 'ARROWDOWN') {
        jumpers[this.id].arrowFlag = true;
    }
};

export default {
    bind: function (el, binding, node) {
        jumpers[el.id] = {};
        jumpers[el.id].name = el.id;
        jumpers[el.id].value = binding.value;
        jumpers[el.id].arg = binding.arg;
        jumpers[el.id].el = el;
        jumpers[el.id].modifiers = binding.modifiers;
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
    },
    inserted: function (el, binding, node) {
        jumpers[el.id].target = node.context.$refs[jumpers[el.id].value];
        if (!jumpers[el.id].target || jumpers[el.id].target === '') {
            jumpers[el.id].target = jumpers[el.id].el;
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
