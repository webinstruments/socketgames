function TextInput(options) {
    this.label = new Label(options.label, options.labelClass, options.name);
    this.group = new DivGroup(options.groupClass);
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    if(options.inputClass) {
        this.input.setAttribute('class', options.inputClass);
    }
    if(options.value) {
        this.input.setAttribute('value', options.value);
    }
    if(options.name) {
        this.input.setAttribute('name', options.name);
    }
    this.group.appendChild(this.label.domElement);
    this.group.appendChild(this.input);
    this.domElement = this.group.domElement;
    this.name = options.name;
    if(options.onFocusOut) {
        this.focusOutCB = options.onFocusOut;
        this.input.addEventListener('focusout', this.focusOut.bind(this));
    }
}

TextInput.prototype.validate = function() {
    var val = this.getValue();
    return val != null && val != '';
}

TextInput.prototype.setText = function(text) {
    this.input.setAttribute('value', text);
}

TextInput.prototype.getValue = function() {
    return this.input.value;
}

TextInput.prototype.focusOut = function() {
    this.focusOutCB(this.getValue(), this);
}