var lastFrameTime = 0;
var frameRate = 16.6667;
var delta = 0;

function startGame() {
    isGameOver = false;
    formDiv.hide();
    setupKeyControls();
    setupOnScreenControls();
    startTimer(textContainer.getTextElement('time'));
    blockController.generateBlock();
    lastFrameTime = 0;
    requestAnimationFrame(render);
}

function gameOver() {
    formHeadLine.setText('Game Over!');
    isGameOver = true;
    blockController.init();
    timer.stop();
    formDiv.show();
}

function render(timestamp) {
    if(lastFrameTime == 0) {
        lastFrameTime = timestamp;
        requestAnimationFrame(render);
    }
    BLOCK_VELOCITY = control.gameSpeed;
    BLOCK_THRESHOLDTIME = control.thresholdTime;
    if(blockController.isGameOver) {
        gameOver();
        return;
    }
    delta += timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    while(delta >= frameRate) {
        blockController.update(frameRate / 1000);
        delta -= frameRate;
    }
    renderer.clear();
    renderer.render(orthoScene, orthoCamera);
    renderer.clearDepth();
    renderer.render(scene, camera);
    stats.update();
    requestAnimationFrame(render);
}