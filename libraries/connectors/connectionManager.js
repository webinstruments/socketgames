function ConnectionManager(url, callbacks, output) {
    this.onErrorClient = callbacks.onError;
    this.clientBinder = callbacks.binder;
    if(!this.clientBinder) {
        this.clientBinder = null;
    }
    callbacks.onError = this.onError;
    callbacks.binder = this;
    this.callbacks = callbacks;
    this.output = output;
    this.connect(url);
}

ConnectionManager.prototype.onError = function(err) {
    if(this.tries == 0) {
        this.onErrorClient(err);
        this.tries++;
        this.connection = new SocketIOConnection(this.url, this.callbacks, this.output);
    } else {
        this.onErrorClient.call(this.clientBinder, err);
    }
}

ConnectionManager.prototype.getUrl = function() {
    return this.url;
}

ConnectionManager.prototype.connect = function(url) {
    //Verbindung wird zuerst mit Standardimplementation aufgebaut
    //Ist dies nicht möglich, dann mit socket io
    //bei Wechsel der Verbindung wieder von vorne
    this.url = url;
    this.tries = 0;
    if(this.connection) {
        this.connection = null;
    }
    this.connection = new SocketConnection(url, this.callbacks, this.output);
}

ConnectionManager.prototype.send = function(msg) {
    this.connection.send(msg);
}