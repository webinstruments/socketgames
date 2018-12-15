var displayController;

function setupOnScreenControls() {
    displayController = new OnScreenController(CONTROL_MODE_ALL, {
        groupTop: '80%',
        leftButtonClass: "left",
        rightButtonClass: "right",
        upButtonClass: "up",
        downButtonClass: "down",
        clickColor: "red",
        leftPos: "left:35%;",
        rightPos: "right:35%;",
        upPos: "top:0%;left:47%;",
        downPos: "bottom:10%;left:47%;",
        leftCB: moveLeft,
        rightCB: moveRight,
        upCB: moveUp,
        downCB: moveDown
    });
    document.body.appendChild(displayController.domElement);
}
  
function setupKeyControls() {
    document.onkeydown = function(e) {
        switch(e.keyCode) {
            case 37: moveLeft();
            break;
            case 39: moveRight();
            break;
            case 38: moveUp();
            break;
            case 40: moveDown();
            break;
        }
    }
}

function moveRemote(message) {
    switch(message) {
        case MOVE_LEFT:
        case SERVER_MOVE_LEFT: blockController.moveLeft();
        break;
        case MOVE_RIGHT:
        case SERVER_MOVE_RIGHT: blockController.moveRight();
        break;
        case MOVE_UP:
        case SERVER_MOVE_UP: blockController.rotate();
        break;
        case MOVE_DOWN:
        case SERVER_MOVE_DOWN: blockController.moveFast();
        break;
    }
}

function moveLeft() {
    displayController.leftClicked();
    blockController.moveShadowLeft();
    sendToServer(MOVE_LEFT);
}

function moveRight() {
    blockController.moveShadowRight();
    displayController.rightClicked();
    sendToServer(MOVE_RIGHT);

}

function moveUp() {
    displayController.upClicked();
    sendToServer(MOVE_UP);
}

function moveDown() {
    displayController.downClicked();
    sendToServer(MOVE_DOWN);
}

function sendToServer(message) {
    socketConnection.send(message);
}