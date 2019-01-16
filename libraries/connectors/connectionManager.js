function ConnectionManager(url, callbacks, output) {
    this.callbacks = callbacks;
    this.output = output;
    this.connect(url);
}

ConnectionManager.prototype.getUrl = function() {
    return this.url;
}

ConnectionManager.prototype.connect = function(url) {
    //Verbindung wird zuerst mit Standardimplementation aufgebaut
    //Ist dies nicht möglich, dann mit socket io
    //bei Wechsel der Verbindung wieder von vorne
    this.url = url;
    if(url === 'ws://193.171.127.8:8080/ws') {
        this.connection = new SocketConnection(url, this.callbacks, this.output);
    } else {
        this.connection = new SocketIOConnection(url, this.callbacks, this.output);
    }
}

ConnectionManager.prototype.send = function(msg, measurement) {
    this.connection.send(msg, measurement);
}