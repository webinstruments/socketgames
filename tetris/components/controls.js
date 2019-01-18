var CONTROL_PAUSE_TEXT = "❚❚";
var CONTROL_RESUME_TEXT = "►";

function setupOnScreenControls() {
    gameGlobals.pauseButton = new GameButton({ 
        classes: "pause noselect",
        clickColor: "blue", 
        onClick: pauseGame,
        text: CONTROL_PAUSE_TEXT,
        dragAble: false
    });
    document.body.appendChild(gameGlobals.pauseButton.domElement);
    gameGlobals.displayController = new OnScreenController(CONTROL_MODE_ALL, {
        groupTop: '78%',
        leftButtonClass: "left noselect control",
        rightButtonClass: "right noselect control",
        upButtonClass: "up noselect control",
        downButtonClass: "down noselect control",
        clickColor: "red",
        leftPos: "left:5%;",
        rightPos: "right:5%;",
        upPos: "top:11%;right:27.1%;",
        downPos: "left:27.1%;",
        leftCB: moveLeft,
        rightCB: moveRight,
        upCB: moveUp,
        downCB: moveDown
    });
    document.body.appendChild(gameGlobals.displayController.domElement);
}
  
function setupKeyControls() {
    document.onkeydown = function(e) {
        if(gameGlobals.released) {
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
            gameGlobals.released = false;
        }
    }
    document.onkeyup = function() {
        gameGlobals.released = true;
    }
}

function moveRemote(message) {
    switch(message) {
        case MOVE_LEFT:
        case SERVER_MOVE_LEFT: gameGlobals.blockController.moveLeft();
        break;
        case MOVE_RIGHT:
        case SERVER_MOVE_RIGHT: gameGlobals.blockController.moveRight();
        break;
        case MOVE_UP:
        case SERVER_MOVE_UP: gameGlobals.blockController.rotate();
        break;
        case MOVE_DOWN:
        case SERVER_MOVE_DOWN: gameGlobals.blockController.moveFast();
        break;
    }
}

function moveLeft() {
    if(gameGlobals.paused) { return; }
    gameGlobals.displayController.leftClicked();
    gameGlobals.blockController.moveShadowLeft();
    sendToServer(MOVE_LEFT);
}

function moveRight() {
    if(gameGlobals.paused) { return; }
    gameGlobals.blockController.moveShadowRight();
    gameGlobals.displayController.rightClicked();
    sendToServer(MOVE_RIGHT);
}

function moveUp() {
    if(gameGlobals.paused) { return; }
    gameGlobals.displayController.upClicked();
    sendToServer(MOVE_UP);
}

function moveDown() {
    if(gameGlobals.paused) { return; }
    gameGlobals.displayController.downClicked();
    sendToServer(MOVE_DOWN);
}

function sendToServer(message) {
    gameGlobals.socketConnection.send(message, true);
}

function pauseGame() {
    gameGlobals.paused = !gameGlobals.paused;
    newFrame();
    gameGlobals.lastFrameTime = 0;
    if(gameGlobals.paused) {
        document.body.classList.add("paused");
        gameGlobals.timer.pause();
        gameGlobals.pauseButton.setText(CONTROL_RESUME_TEXT);
        showInfo("Game paused");
    } else {
        document.body.classList.remove("paused");
        gameGlobals.timer.resume();
        gameGlobals.pauseButton.setText(CONTROL_PAUSE_TEXT);
        showInfo("Game resumed");
    }
}