function Timer(htmlText) {
    this.text = htmlText;
    this.timer = null;
    this.paused = false;
    this.reset();
}

Timer.prototype.counter = function() {
    if(!this.paused) {
        this.text.innerText = ++this.seconds;
    }
}

Timer.prototype.pause = function() {
    this.paused = true;
}

Timer.prototype.resume = function() {
    this.paused = false;
}

Timer.prototype.start = function() {
    this.timer = setInterval(this.counter.bind(this), 1000);
}

Timer.prototype.stop = function() {
    clearInterval(this.timer);
}

Timer.prototype.reset = function () {
    this.stop();
    this.seconds = 0;
}