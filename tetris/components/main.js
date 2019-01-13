var lastFrameTime = 0;
var frameRate = 16.6667;
var delta = 0;
var requestId;

function startGame() {
    document.body.classList.add("noselect");
    isGameOver = false;
    formDiv.hide();
    scoreController.reset();
    startTimer(textContainer.getTextElement('time'));
    blockController.generateBlock();
    lastFrameTime = 0;
    newFrame();
}

function gameOver() {
    document.body.classList.remove("noselect");
    formHeadLine.setText('Game Over!');
    isGameOver = true;
    blockController.init();
    timer.stop();
    restService.end();
    formDiv.show();
}

var stepValue = frameRate / 1000;
function render(timestamp) {
    if(paused) { return; }
    if(lastFrameTime == 0) {
        lastFrameTime = timestamp;
        newFrame();
    }
    BLOCK_VELOCITY = control.gameSpeed;
    BLOCK_THRESHOLDTIME = control.thresholdTime;
    delta += timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    if(delta / frameRate >= 60) {
        //game was paused
        console.log('synching');
        delta = 0;
    }
    while(delta >= frameRate) {
        if(blockController.isGameOver) {
            gameOver();
            cancelAnimationFrame(requestId);
            return;
        }
        blockController.update(stepValue);
        delta -= frameRate;
    }
    renderer.clear();
    renderer.render(orthoScene, orthoCamera);
    renderer.clearDepth();
    renderer.render(scene, camera);
    stats.update();
    newFrame();
}

function newFrame() {
    requestId = requestAnimationFrame(render);
}