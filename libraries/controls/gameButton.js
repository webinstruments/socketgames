function GameButton(options) {
    this.classes = options.classes;
    this.style = options.style;
    this.onClick = options.onClick;
    this.clickColor = options.clickColor;
    this.timer = null;
    this.domElement = document.createElement('i');
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
    this.domElement.addEventListener('touchstart', this.dragStart.bind(this), false);
    this.domElement.addEventListener('touchend', this.dragEnd.bind(this), false);
    this.domElement.addEventListener('touchmove', this.drag.bind(this), false);
    
    this.domElement.addEventListener('mousedown', this.dragStart.bind(this), false);
    this.domElement.addEventListener('mouseup', this.dragEnd.bind(this), false);
    this.domElement.addEventListener('mousemove', this.drag.bind(this), false);

    this.offsetX = 0;
    this.offsetY = 0;
    this.rotation = '';
    if(options.rotation) {
        this.rotation = "rotate(" + options.rotation + "deg)";
    }
    this.startX = this.startY = this.clickedOn = null;
    this.dragged = false;
    this.dragAble = false;
    this.dragTimer = null;
}

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

GameButton.prototype.isDragging = function() {
    if(this.dragAble && this.draggingPossible()) {
        this.addClass("dragging");
        this.dragged = true;
        showInfo("Dragging started");
    }
    clearTimeout(this.dragTimer);
    this.dragTimer = null;
}

GameButton.prototype.dragStart = function() {
    this.clickedOn = Date.now();
    if(!this.startX) {
        var pos = this.getPosition();
        this.startX = pos.x;
        this.startY = pos.y;
    }
    this.dragAble = true;
    if(!this.dragTimer) {
        this.dragTimer = setTimeout(this.isDragging.bind(this), 1500);
    }
}

GameButton.prototype.dragEnd = function(event) {
    this.clickedOn = null;
    this.dragAble = false;
    if(this.dragged) {
        this.removeClass("dragging");
    }
}

GameButton.prototype.drag = function(event) {
    if(this.dragAble && this.draggingPossible()) {
        var newX = newY = null;
        if(event.type == "touchmove") {
            newX = event.touches[0].clientX - this.startX;
            newY = event.touches[0].clientY - this.startY;
        } else {
            newX = event.clientX - this.startX;
            newY = event.clientY - this.startY;
        }
        this.removeStyle("transform", true);
        var style = "transform:translate3d(" + newX.toFixed(0) + "px," + newY.toFixed(0) + "px,0px) " + this.rotation;
        this.setStyle(style);
    }
}

GameButton.prototype.draggingPossible = function() {
    return this.clickedOn && Date.now() - this.clickedOn >= 1500;
}

GameButton.prototype.getPosition = function() {
    var rect = this.domElement.getBoundingClientRect();
    var centerX = (rect.right - rect.left) / 2;
    var x = rect.left + centerX;
    var centerY = (rect.bottom - rect.top) / 2;
    var y = rect.top + centerY;

    return { x: x, y: y };
}

GameButton.prototype.setText = function(text) {
    this.domElement.innerHTML = text;
}