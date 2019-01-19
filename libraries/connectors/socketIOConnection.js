function SocketIOConnection(url, callbacks, output) {
    SocketConnection.call(this, url, callbacks, output);
}

SocketIOConnection.prototype = Object.create(SocketConnection.prototype);

SocketIOConnection.prototype.connect = function(url) {
    this.socket = io(url);
    if(!this.socket) {
        return;
    }
    var self = this;
    this.socket.on('connect', function() {
        self.onOpen();
    });
    this.socket.on('message', function(msg) {
        self.onMessage(msg);
    });
    this.socket.on('disconnect', function() {
        self.onClose();
    });
    this.socket.on('connect_error', function(err) {
        self.onError(err.message);
    });
}

SocketIOConnection.prototype.onError = function(err) {
    SocketConnection.prototype.onError.call(this, err);
    this.socket.disconnect();
}

SocketIOConnection.prototype.isClosed = function() {
    return this.socket.connected == true;
}

SocketIOConnection.prototype.reConnect = function() {
    //empty, socket io handles this.
}