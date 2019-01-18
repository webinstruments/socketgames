function GameButton(options) {
    this.classes = options.classes;
    this.style = options.style;
    this.onClick = options.onClick;
    this.clickColor = options.clickColor;
    this.timer = null;
    this.domElement = document.createElement('div');
    if(this.classes) {
        this.domElement.setAttribute('class', this.classes);
    }
    if(options.text) {
        this.setText(options.text)
    }
    if(this.style) {
        this.domElement.setAttribute('style', this.style);
    }
    if(options.onClick != null) {
        this.domElement.addEventListener('click', this.clicked.bind(this), false);
    }
    DragAble.call(this, this.domElement, options.rotation, {
        startCB: this.onDragStart,
        endCB: this.onDragEnd,
        moveCB: this.onDrag
    });
    if(!options.dragAble) {
        this.canDrag = false;
    }
}

GameButton.prototype = Object.create(DragAble.prototype);

GameButton.prototype.clicked = function() {
    if(this.dragged) {
        this.dragged = false;
        return;
    }
    this.setColor();
    this.onClick();
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

GameButton.prototype.addClass = function(val) {
    this.domElement.classList.add(val);
}

GameButton.prototype.removeClass = function(val) {
    this.domElement.classList.remove(val);
}

GameButton.prototype.setStyle = function(val) {
    var currentAttributes = this.domElement.getAttribute('style');
    if(!currentAttributes) {
        currentAttributes = '';
    }
    if(currentAttributes != '' && !currentAttributes.endsWith(';')) {
        currentAttributes += ';';
    }
    this.domElement.setAttribute('style', currentAttributes + val + ';')
}

GameButton.prototype.removeStyle = function(val, fuzzy) {
    var style = this.domElement.getAttribute('style');
    if(!style || style == '') { return; }
    var currentAttributes = style.replace(' ', ''); //IE Workaround
    var replacedStyle = '';
    if(fuzzy) {
        var regex = new RegExp(val + ".*(;)?$", "g");
        replacedStyle = currentAttributes.replace(regex, "");
    } else if(currentAttributes) {
        replacedStyle = currentAttributes.replace(val + ';', '').replace(';;', '');
    }
    this.domElement.setAttribute('style', replacedStyle);
}

GameButton.prototype.setText = function(text) {
    this.domElement.innerHTML = text;
}

GameButton.prototype.onDrag = function(x, y) {
    if(!this.canDrag) { return; }
    this.removeStyle("transform", true);
    var style = "transform:translate3d(" + x.toFixed(0) + "px," + y.toFixed(0) + "px,0px) " + this.rotation;
    this.setStyle(style);
}

GameButton.prototype.onDragStart = function() {
    if(!this.canDrag) { return; }
    this.addClass("dragging");
    showInfo("Dragging started");
}

GameButton.prototype.onDragEnd = function() {
    if(!this.canDrag) { return; }
    this.removeClass("dragging");
}