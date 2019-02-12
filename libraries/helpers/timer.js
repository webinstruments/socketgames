function Timer(htmlText) {
    this.text = htmlText;
    this.timer = null;
    this.paused = false;
    this.reset();
}

Timer.prototype.counter = function() {
    if(!this.paused) {
        ++this.seconds;
        if(this.seconds < 60) {
            this.text.innerText = this.seconds;
        } else {
            this.text.innerText = Timer.toMinutes(this.seconds) + "m";
        }
    }
}

Timer.prototype.pause = function() {
    this.paused = true;
}

Timer.toMinutes = function(seconds) {
    return parseInt(Math.floor(seconds / 60));
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