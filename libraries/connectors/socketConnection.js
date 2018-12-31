var SOCKET_CONNECTION_SERVER_PREFIX = "server_";

function SocketConnection(url, callbacks, output) {
    this.callbacks = callbacks;
    if(!this.callbacks.binder) {
        this.callbacks.binder = null;
    }
    this.output = output;
    this.connected = false;
    this.url = url;
    this.delays = [];
    this.delayId = 0;
    this.connect(url);
}

SocketConnection.prototype.onOpen = function() {
    this.connected = true;
    if(this.callbacks.onOpen) {
        this.callbacks.onOpen.call(this.callbacks.binder);
    }
}

SocketConnection.prototype.onMessage = function(msg) {
    if(msg.indexOf(SOCKET_CONNECTION_SERVER_PREFIX) == 0) {
        msg = msg.slice(0, SOCKET_CONNECTION_SERVER_PREFIX.length + 1);
    } else {
        var msgParts = msg.split('~'); //eigene id filtern
        msg = msgParts[0];
        var id = findFromArray(msgParts, function(m) {
            return !isNaN(m) && isFinite(m);
        });
        if(id) {
            var index = 'id_' + id;
            var delay = Date.now() - this.delays[index];
            delete this.delays[index];
            this.output.innerHTML = delay + 'ms';
        }
    }
    if(this.callbacks.onMessage) {
        this.callbacks.onMessage.call(this.callbacks.binder, msg);
    }
}

SocketConnection.prototype.onClose = function() {
    this.connected = false;
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

SocketConnection.prototype.send = function(message) {
    //Daten werden im internen Format gesendet (richtung~id~)
    this.delays['id_' + this.delayId + ''] = Date.now();
    this.socket.send(message + '~' + (this.delayId++) + '~');
}