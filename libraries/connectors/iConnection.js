var SOCKET_CONNECTION_SERVER_PREFIX = "server_";

function iConnection(url, onMessageCB, output) {
    this.url = url;
    this.onMessageCB = onMessageCB;
    this.delays = [];
    this.delayId = 0;
    this.output = output;
}

iConnection.prototype.onMessage = function(msg) {
    var delay = null;
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
            delay = Date.now() - this.delays[index];
            delete this.delays[index];
            this.output.innerHTML = delay + 'ms';
        }
    }
    if(this.onMessageCB) {
        this.onMessageCB.call(this.callbacks.binder, msg, delay);
    }
}

iConnection.prototype.send = function(message, measurement) {
    //Daten werden im internen Format gesendet (richtung~id~)
    if(measurement) {
        this.delays['id_' + this.delayId + ''] = Date.now();
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