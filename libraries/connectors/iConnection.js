var SOCKET_CONNECTION_SERVER_PREFIX = "server_";

function iConnection(url, onMessageCB) {
    this.url = url;
    this.onMessageCB = onMessageCB;
    this.delays = [];
    this.delayId = 0;
}

iConnection.prototype.onMessage = function(msg) {
    var delay = null;
    if(msg.indexOf(SOCKET_CONNECTION_SERVER_PREFIX) == 0) {
        msg = msg.slice(0, SOCKET_CONNECTION_SERVER_PREFIX.length + 1);
    } else {
        var msgParts = msg.match(/(.*)~(\d+)~/);
        if(msgParts) {
            msg = msgParts[1];
            var index = 'id_' + msgParts[2];
            delay = Date.now() - this.delays[index];
            delete this.delays[index];
        }
    }
    if(this.onMessageCB) {
        this.onMessageCB.call(this.callbacks.binder, msg, delay);
    }
}

iConnection.prototype.send = function(message, measurement) {
    //Daten werden im internen Format gesendet (richtung~id~)
    if(measurement) {
        this.delays['id_' + this.delayId] = Date.now();
        this.sendMessage(message + '~' + (this.delayId++) + '~');
    } else {
        this.sendMessage(message);
    }
}

iConnection.prototype.sendMessage = function(message) {
    //to be overriden...
}

iConnection.prototype.connect = function(url) {
    //to be overriden...
}

iConnection.prototype.reConnect = function() {
    this.connect(this.url);
}

iConnection.prototype.isClosed = function() {
    return false; //to be overriden...
}

iConnection.prototype.getUrl = function() {
    return this.url;
}