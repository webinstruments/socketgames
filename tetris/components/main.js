function startGame() {
    gameGlobals.stats.show();
    document.body.classList.add("noselect");
    isGameOver = false;
    gameGlobals.formDiv.hide();
    gameGlobals.scoreController.reset();
    startTimer(gameGlobals.textContainer.getTextElement('time'));
    gameGlobals.blockController.generateBlock();
    gameGlobals.lastFrameTime = 0;
    newFrame();
    hideScoreButton();
    hideLogo();
    
    if(gameGlobals.firstStart) {
        pauseGame();
        setFirstStartText();
        gameGlobals.firstStart = false;
        document.body.classList.add('firstStart');
        setTimeout(function() {
            document.body.classList.remove('firstStart');
        }, 5000);
    }
}

function gameOver() {
    document.body.classList.remove("noselect");
    gameGlobals.formHeadLine.setText('Game Over!');
    isGameOver = true;
    gameGlobals.blockController.init();
    gameGlobals.timer.stop();
    gameGlobals.restService.end(gameGlobals.scoreController.getScore());
    gameGlobals.formDiv.show();
    gameGlobals.stats.hide();
    showScoreButton();
    showLogo();
}

function render(timestamp) {
    if(gameGlobals.paused) { return; }
    if(gameGlobals.lastFrameTime == 0) {
        gameGlobals.lastFrameTime = timestamp;
        newFrame();
    }
    BLOCK_VELOCITY = gameGlobals.control.gameSpeed;
    BLOCK_THRESHOLDTIME = gameGlobals.control.thresholdTime;
    gameGlobals.delta += timestamp - gameGlobals.lastFrameTime;
    gameGlobals.lastFrameTime = timestamp;
    if(gameGlobals.delta / gameGlobals.frameRate >= 60) {
        //game was paused
        console.log('synching');
        gameGlobals.delta = 0;
        if(gameGlobals.socketConnection.connection.isClosed()) {
            handleDisconnection();
        }
    }
    while(gameGlobals.delta >= gameGlobals.frameRate) {
        if(gameGlobals.blockController.isGameOver) {
            gameOver();
            cancelAnimationFrame(gameGlobals.requestId);
            return;
        }
        gameGlobals.blockController.update(gameGlobals.stepValue);
        gameGlobals.delta -= gameGlobals.frameRate;
    }
    gameGlobals.renderer.clear();
    /*gameGlobals.renderer.render(gameGlobals.orthoScene, gameGlobals.orthoCamera);
    gameGlobals.renderer.clearDepth();*/
    gameGlobals.renderer.render(gameGlobals.scene, gameGlobals.camera);
    gameGlobals.stats.update();
    newFrame();
}

function newFrame() {
    gameGlobals.requestId = requestAnimationFrame(render);
}