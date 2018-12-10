var CONTROL_MODE_LEFTRIGHT = 0;
var CONTROL_MODE_UPDOWN = 1;
var CONTROL_MODE_LEFTRIGHTUP = 2;
var CONTROL_MODE_LEFTRIGHTDOWN = 3;
var CONTROL_MODE_ALL = 4;

function OnScreenController(mode, initObject) {
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('style', 
        'position:absolute;top:0px;left:0px;opacity:0.9;z-index:10000;width:100%;height:100%');
    this.buttonGroup = document.createElement('div');
    this.groupStyles = [
        [ "position", "absolute" ],
        [ "top", initObject.groupTop ? initObject.groupTop : '80%' ],
        [ "width", "100%" ],
        [ "height", "20%" ],
    ];
    this.leftButton = new GameButton(initObject.leftButtonClass, initObject.leftPos, initObject.clickColor, initObject.leftCB);
    this.rightButton = new GameButton(initObject.rightButtonClass, initObject.rightPos, initObject.clickColor, initObject.rightCB);
    this.upButton = new GameButton(initObject.upButtonClass, initObject.upPos, initObject.clickColor, initObject.upCB);
    this.downButton = new GameButton(initObject.downButtonClass, initObject.downPos, initObject.clickColor, initObject.downCB);
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

OnScreenController.prototype.applyGroupStyle = function() {
    var styles = '';
    for(var i = 0; i < this.groupStyles.length; ++i) {
        styles += this.groupStyles[i].join(':') + ';';
    }
    this.buttonGroup.setAttribute('style', styles);
}