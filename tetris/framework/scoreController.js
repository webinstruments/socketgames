var BASIC_POINTS = 100;

function ScoreController(rowCountElement, scoreElement) {
    this.rowCount = rowCountElement
    this.scoreCount = scoreElement;
    this.init();
}

ScoreController.prototype.init = function() {
    this.score = 0;
    this.scoreToAdd = 0;
    this.rows = 0;
    if(this.timer) {
        clearInterval(this.timer);
    }
    this.timer = null;
}

ScoreController.prototype.scoreChanged = function(rows, multiplier) {
    this.steps = 10;
    this.rows += rows;
    var tempScore = BASIC_POINTS * rows * multiplier;
    this.scoreToAdd += (tempScore - (tempScore % 10));
    this.scoreChunk = this.scoreToAdd / this.steps;
    this.rowCount.innerHTML = this.rows;
    if(!this.timer) {
        this.timer = setInterval(this.addScore.bind(this), 1000 / this.steps);
    }
}

ScoreController.prototype.addScore = function() {
    this.score += this.scoreChunk;
    this.scoreToAdd -= this.scoreChunk;
    this.scoreCount.innerHTML = Math.ceil(this.score);
    if(--this.steps == 0) {
        clearInterval(this.timer);
        this.timer = null;
    }
}

ScoreController.prototype.reset = function() {
    this.init();
    this.scoreCount.innerHTML = 0;
    this.rowCount.innerHTML = 0;
}

ScoreController.prototype.getScore = function() {
    return this.score;
}