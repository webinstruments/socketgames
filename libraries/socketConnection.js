function SocketConnection(url, output, callbacks) {
    this.callbacks = callbacks;
    this.output = output;
    this.connect(url);
}

SocketConnection.prototype.onOpen = function() {
    this.connected = true;
    if(this.callbacks.onOpen) {
        this.callbacks.onOpen();
    }
}

SocketConnection.prototype.onMessage = function(msg) {
    this.connected = true;
    var msgParts = msg.data.split('~');
    var index = 'id_' + msgParts[msgParts.length - 1];
    var delay = Date.now() - this.delays[index];
    delete this.delays[index];
    this.output.innerHTML = delay + 'ms';
    if(this.callbacks.onMessage) {
        this.callbacks.onMessage(msgParts[0]);
    }
}

SocketConnection.prototype.onClose = function() {
    this.connected = false;
    if(this.callbacks.onClose) {
        this.callbacks.onClose();
    }
}

SocketConnection.prototype.onError = function(err) {
    console.log('websocket error', err);
    if(this.callbacks.onError) {
        this.callbacks.onError();
    }
}

SocketConnection.prototype.getUrl = function() {
    return this.url;
}

SocketConnection.prototype.connect = function(url) {
    this.connected = false;
    this.socket = new WebSocket(url);
    this.url = url;
    this.delays = [];
    this.delayId = 0;
    if(!this.socket) {
        //Todo - other implementation
    }
    var self = this;
    this.socket.onopen = function() {
        self.onOpen();
    }
    this.socket.onmessage = function(msg) {
        self.onMessage(msg);
    }
    this.socket.onclose = function() {
        self.onClose;
    }
    this.socket.onerror = function(err) {
        self.onError(err.data);
    }
}

SocketConnection.prototype.send = function(message) {
    this.delays['id_' + this.delayId + ''] = Date.now();
    this.socket.send(message + '~' + this.delayId++);
}