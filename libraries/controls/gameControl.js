var CONTROL_MODE_LEFTRIGHT = 0;
var CONTROL_MODE_UPDOWN = 1;
var CONTROL_MODE_LEFTRIGHTUP = 2;
var CONTROL_MODE_LEFTRIGHTDOWN = 3;
var CONTROL_MODE_ALL = 4;

function OnScreenController(mode, initObject) {
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('style', 
        'position:absolute;top:0px;left:0px;opacity:0.9;width:100%;height:100%;z-index:1;');
    this.buttonGroup = document.createElement('div');
    this.groupStyles = [
        [ "position", "absolute" ],
        [ "top", initObject.groupTop ? initObject.groupTop : '60%' ],
        [ "width", "100%" ],
        [ "height", "40%" ],
    ];
    this.leftButton = new GameButton({ 
        classes: initObject.leftButtonClass, 
        style: initObject.leftPos, 
        clickColor: initObject.clickColor, 
        onClick: initObject.leftCB,
        rotation: 135,
        dragAble: true
    });
    this.rightButton = new GameButton({ 
        classes: initObject.rightButtonClass, 
        style: initObject.rightPos, 
        clickColor: initObject.clickColor, 
        onClick: initObject.rightCB,
        rotation: -45,
        dragAble: true
    });
    this.upButton = new GameButton({ 
        classes: initObject.upButtonClass, 
        style: initObject.upPos, 
        clickColor: initObject.clickColor, 
        onClick: initObject.upCB,
        rotation: -135,
        dragAble: true
    });
    this.downButton = new GameButton({ 
        classes: initObject.downButtonClass, 
        style: initObject.downPos, 
        clickColor: initObject.clickColor, 
        onClick: initObject.downCB,
        rotation: 45,
        dragAble: true
    });
    switch(mode) {
        case CONTROL_MODE_ALL:
            this.buttonGroup.appendChild(this.upButton.domElement);
        case CONTROL_MODE_LEFTRIGHTDOWN:
            this.buttonGroup.appendChild(this.downButton.domElement);
        case CONTROL_MODE_LEFTRIGHT:
            this.buttonGroup.appendChild(this.leftButton.domElement);
            this.buttonGroup.appendChild(this.rightButton.domElement);
            break;
        case CONTROL_MODE_LEFTRIGHTUP:
            this.buttonGroup.appendChild(this.leftButton.domElement);
            this.buttonGroup.appendChild(this.rightButton.domElement);
            this.buttonGroup.appendChild(this.upButton.domElement);
            break;
    }
    this.applyGroupStyle();
    this.domElement.appendChild(this.buttonGroup);
}

OnScreenController.prototype.leftClicked = function() {
    this.leftButton.setColor();
}

OnScreenController.prototype.rightClicked = function() {
    this.rightButton.setColor();
}

OnScreenController.prototype.upClicked = function() {
    this.upButton.setColor();
}

OnScreenController.prototype.downClicked = function() {
    this.downButton.setColor();
}

OnScreenController.prototype.applyGroupStyle = function() {
    var styles = '';
    for(var i = 0; i < this.groupStyles.length; ++i) {
        styles += this.groupStyles[i].join(':') + ';';
    }
    this.buttonGroup.setAttribute('style', styles);
}