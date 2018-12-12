function Timer(htmlText) {
    this.text = htmlText;
    this.timer;
    this.reset();
}

Timer.prototype.counter = function() {
    this.text.innerText = ++this.seconds;
}

Timer.prototype.start = function() {
    this.timer = setInterval(this.counter.bind(this), 1000);
}

Timer.prototype.stop = function() {
    clearInterval(this.timer);
}

Timer.prototype.reset = function () {
    this.seconds = 0;
}