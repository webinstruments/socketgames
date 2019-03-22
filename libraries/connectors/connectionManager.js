var WORKER_MESSAGES = {
    connect: 'connect',
    reconnect: 'reconnect',
    status: 'status',
    close: 'close',
    send: 'send',
    onopen: 'onOpen',
    onerror: 'onError',
    onclose: 'onClose',
    onmessage: 'onMessage',
};

function ConnectionManager(url, callbacks, worker) {
    this.callbacks = callbacks;
    this.closedStackCBs = [];
    this.worker = worker;
    this.worker.addEventListener('message', this.onWorkerMessage.bind(this), false);
    this.connect(url);
}

ConnectionManager.prototype.getUrl = function() {
    return this.url;
}

ConnectionManager.prototype.connect = function(url) {
    this.url = url;
    this.sendWorkerMessage(WORKER_MESSAGES.connect, url);
}

ConnectionManager.prototype.isClosed = function(callback) {
    this.sendWorkerMessage(WORKER_MESSAGES.status);
    this.closedStackCBs.push(callback);
}

ConnectionManager.prototype.reConnect = function() {
    this.sendWorkerMessage(WORKER_MESSAGES.reconnect);
}

ConnectionManager.prototype.close = function() {
    this.sendWorkerMessage(WORKER_MESSAGES.close);
}

ConnectionManager.prototype.sendWorkerMessage = function(type, message, measurement) {
    this.worker.postMessage({ type: type, message: message, measurement: measurement });
}

ConnectionManager.prototype.onWorkerMessage = function(event) {
    var data = JSON.parse(event.data);
    switch(data.type) {
        case WORKER_MESSAGES.onmessage:
            this.callbacks.onMessage(data.message, data.delay);
        break;
        case WORKER_MESSAGES.onopen:
            this.callbacks.onOpen();
        break;
        case WORKER_MESSAGES.onclose:
            this.callbacks.onClose();
        break;
        case WORKER_MESSAGES.onerror:
            this.callbacks.onError(data.message);
        break;
        case WORKER_MESSAGES.status:
            while(this.closedStackCBs.length) {
                this.closedStackCBs.pop()(data.message);
            }
        break;
    }
}

ConnectionManager.prototype.send = function(msg, measurement) {
    this.sendWorkerMessage(WORKER_MESSAGES.send, msg, measurement);
}