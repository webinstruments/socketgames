function SocketConnection(url, callbacks) {
    iConnection.call(this, url, callbacks.onMessage);
    this.callbacks = callbacks;
    if(!this.callbacks.binder) {
        this.callbacks.binder = null;
    }
    this.connect(url);
}

SocketConnection.prototype = Object.create(iConnection.prototype);

SocketConnection.prototype.onOpen = function() {
    if(this.callbacks.onOpen) {
        this.callbacks.onOpen.call(this.callbacks.binder);
    }
}

SocketConnection.prototype.onClose = function() {
    if(this.callbacks.onClose) {
        this.callbacks.onClose.call(this.callbacks.binder);
    }
}

SocketConnection.prototype.onError = function(err) {
    console.log('websocket error', err);
    if(this.callbacks.onError) {
        this.callbacks.onError.call(this.callbacks.binder, err);
    }
}

SocketConnection.prototype.getUrl = function() {
    return this.url;
}

SocketConnection.prototype.connect = function(url) {
    this.socket = new WebSocket(url);
    if(!this.socket) {
        //Todo - other implementation
        return;
    }
    var self = this;
    this.socket.onopen = function() {
        self.onOpen();
    }
    this.socket.onmessage = function(msg) {
        self.onMessage(msg.data);
    }
    this.socket.onclose = function() {
        self.onClose();
    }
    this.socket.onerror = function(err) {
        self.onError(err.data);
    }
}

SocketConnection.prototype.sendMessage = function(message) {
    this.socket.send(message);
}

SocketConnection.prototype.isClosed = function() {
    return this.socket.readyState == this.socket.CLOSED;
}