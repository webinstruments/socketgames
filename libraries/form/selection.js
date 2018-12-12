function Selector(name, values, label, labelClass, groupClass, selectorClass, btnClass) {
    this.selector = new TextInput(name, values[0].name, selectorClass, label, labelClass, groupClass);
    this.selector.input.setAttribute('readonly', '');
    this.selector.input.setAttribute('style', 'display:relative');
    this.index = 0;
    this.leftButton = new Button('<', btnClass, function() {
        this.scroll(--this.index);
    }, this);
    this.rightButton = new Button('>', btnClass, function() {
        this.scroll(++this.index);
    }, this);
    this.domElement = this.selector.domElement;
    this.domElement.appendChild(this.leftButton.domElement);
    this.domElement.appendChild(this.rightButton.domElement);
    this.values = values;
    this.name = name;
}

Selector.prototype.scroll = function() {
    if(this.index < 0) {
        this.index = 0;
    }
    this.index = this.index % this.values.length;
    this.selector.setText(this.values[this.index].name);
}

Selector.prototype.getValue = function() {
    return this.values[this.index].value;
}