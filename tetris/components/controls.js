function setupOnScreenControls() {
    pauseButton = new GameButton({ 
        classes: "pause noselect",
        clickColor: "blue", 
        onClick: pauseGame,
        text: "▌▌"
    });
    document.body.appendChild(pauseButton.domElement);
    gameGlobals.displayController = new OnScreenController(CONTROL_MODE_ALL, {
        groupTop: '80%',
        leftButtonClass: "left noselect",
        rightButtonClass: "right noselect",
        upButtonClass: "up noselect",
        downButtonClass: "down noselect",
        clickColor: "red",
        leftPos: "left:10%;",
        rightPos: "right:10%;",
        upPos: "top:0%;left:47%;",
        downPos: "bottom:10%;left:47%;",
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
    socketConnection.send(message, true);
}

function pauseGame() {
    gameGlobals.paused = !gameGlobals.paused;
    newFrame();
    gameGlobals.lastFrameTime = 0;
    if(gameGlobals.paused) {
        document.body.classList.add("paused");
        showInfo("Game paused");
        timer.pause();
    } else {
        document.body.classList.remove("paused");
        showInfo("Game resumed");
        timer.resume();
    }
}