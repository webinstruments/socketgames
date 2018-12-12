function TextContainer(groupClass, textObjects) {
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('class', groupClass);
    this.texts = [];
    var self = this;
    textObjects.map(function(text) {
        self.addText(text.id, text.label, text.value);
    });
}

TextContainer.prototype.addText = function(id, label, value) {
    var p = document.createElement('p');
    p.innerText = label;
    this.texts[id] = document.createElement('span');
    if(value) {
        this.texts[id].innerText = value;
    }
    p.appendChild(this.texts[id]);
    this.domElement.appendChild(p);
}

TextContainer.prototype.setText = function(id, value) {
    this.texts[id].innerText = value;
}

TextContainer.prototype.getTextElement = function(id) {
    return this.texts[id];
}