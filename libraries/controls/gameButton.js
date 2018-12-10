function GameButton(classes, style, clickColor, listener) {
    this.classes = classes;
    this.style = style;
    this.listener = listener;
    this.clickColor = clickColor;
    this.timer = null;
    this.domElement = document.createElement('i');
    if(this.classes) {
        this.domElement.setAttribute('class', this.classes);
    }
    if(this.style) {
        this.domElement.setAttribute('style', this.style);
    }
    if(listener != null) {
        this.domElement.addEventListener('click', this.clicked.bind(this), false);
    }
}

GameButton.prototype.clicked = function() {
    this.setColor();
    this.listener();
}

GameButton.prototype.setColor = function() {
    if(this.clickColor && !this.timer) {
        this.setStyle('border-color:' + this.clickColor);
        this.timer = setTimeout(this.removeColor.bind(this), 500);
    }
}

GameButton.prototype.removeColor = function() {
    this.removeStyle('border-color:' + this.clickColor);
    clearTimeout(this.timer);
    this.timer = null;
}

GameButton.prototype.setStyle = function(val) {
    var currentAttributes = this.domElement.getAttribute('style');
    if(!currentAttributes) {
        currentAttributes = '';
    }
    this.domElement.setAttribute('style', currentAttributes + ';' + val + ';')
}

GameButton.prototype.removeStyle = function(val) {
    var currentAttributes = this.domElement.getAttribute('style').replace(' ', ''); //IE Workaround
    if(currentAttributes) {
        var replacedStyle = currentAttributes.replace(val + ';', '').replace(';;', '');
        console.log(replacedStyle);
        this.domElement.setAttribute('style', replacedStyle);
    }
}