function TextInput(name, value, inputClass, label, labelClass, groupClass) {
    this.label = new Label(label, labelClass, name);
    this.group = new DivGroup(groupClass);
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('class', inputClass);
    this.input.setAttribute('value', value);
    this.input.setAttribute('name', name);
    this.group.appendChild(this.label.domElement);
    this.group.appendChild(this.input);
    this.domElement = this.group.domElement;
    this.name = name;
}

TextInput.prototype.validate = function() {
    var val = this.input.getAttribute('value');
    return val != null && val != '';
}

TextInput.prototype.setText = function(text) {
    this.input.setAttribute('value', text);
}

TextInput.prototype.getValue = function() {
    return this.input.getAttribute('value');
}