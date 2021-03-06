function Selector(options) {
    this.selector = new TextInput({
        name: options.name, 
        value: options.values[0].name,
        inputClass: options.selectorClass,
        label: options.label,
        labelClass: options.labelClass,
        groupClass: options.groupClass,
        inputClass: options.inputClass
    });
    this.selector.input.setAttribute('readonly', '');
    this.selector.input.setAttribute('style', 'display:relative');
    this.index = 0;
    this.leftButton = new Button('<', options.btnClass, function() {
        this.scroll(--this.index);
    }, this);
    this.rightButton = new Button('>', options.btnClass, function() {
        this.scroll(++this.index);
    }, this);
    this.domElement = this.selector.domElement;
    this.domElement.appendChild(this.leftButton.domElement);
    this.domElement.appendChild(this.rightButton.domElement);
    this.values = options.values;
    this.name = options.name;
}

Selector.prototype.scroll = function() {
    if(this.index < 0) {
        this.index = this.values.length - 1;
    }
    this.index = this.index % this.values.length;
    this.selector.setText(this.values[this.index].name);
}

Selector.prototype.getValue = function() {
    return this.values[this.index].value;
}

Selector.prototype.setValues = function(options) {
    this.values = options;
    this.index = 0;
    this.scroll();
}