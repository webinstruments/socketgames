function startGame() {
    document.body.classList.add("noselect");
    isGameOver = false;
    formDiv.hide();
    scoreController.reset();
    startTimer(textContainer.getTextElement('time'));
    gameGlobals.blockController.generateBlock();
    gameGlobals.lastFrameTime = 0;
    newFrame();
}

function gameOver() {
    document.body.classList.remove("noselect");
    formHeadLine.setText('Game Over!');
    isGameOver = true;
    gameGlobals.blockController.init();
    timer.stop();
    restService.end(scoreController.getScore());
    formDiv.show();
}

var stepValue = gameGlobals.frameRate / 1000;
function render(timestamp) {
    if(gameGlobals.paused) { return; }
    if(gameGlobals.lastFrameTime == 0) {
        gameGlobals.lastFrameTime = timestamp;
        newFrame();
    }
    BLOCK_VELOCITY = control.gameSpeed;
    BLOCK_THRESHOLDTIME = control.thresholdTime;
    gameGlobals.delta += timestamp - gameGlobals.lastFrameTime;
    gameGlobals.lastFrameTime = timestamp;
    if(gameGlobals.delta / gameGlobals.frameRate >= 60) {
        //game was paused
        console.log('synching');
        gameGlobals.delta = 0;
    }
    while(gameGlobals.delta >= gameGlobals.frameRate) {
        if(gameGlobals.blockController.isGameOver) {
            gameOver();
            cancelAnimationFrame(gameGlobals.requestId);
            return;
        }
        gameGlobals.blockController.update(stepValue);
        gameGlobals.delta -= gameGlobals.frameRate;
    }
    renderer.clear();
    renderer.render(gameGlobals.orthoScene, orthoCamera);
    renderer.clearDepth();
    renderer.render(gameGlobals.scene, camera);
    stats.update();
    newFrame();
}

function newFrame() {
    gameGlobals.requestId = requestAnimationFrame(render);
}