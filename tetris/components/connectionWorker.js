importScripts(
    '../../libraries/fakejQueryDOM.js', //fake DOM Elements for jQuery - else error
    '../../libraries/socket.io_2.0.3.js',
    '../../libraries/jquery-3.3.1.min.js',
    '../../libraries/connectors/iConnection.js', 
    '../../libraries/connectors/restConnection.js', 
    '../../libraries/connectors/socketConnection.js', 
    '../../libraries/connectors/socketIOConnection.js',
    '../../libraries/connectors/connectionManager.js' //globals are needed
    );

var connection = null;

self.addEventListener('message', function(event) {
    var data = event.data;
    switch(data.type) {
        case WORKER_MESSAGES.connect:
            var url = data.message;
            var callbacks = {
                onMessage: onMessage,
                onError: onError,
                onClose: onClose,
                onOpen: onOpen
            };
            if(url === 'ws://193.171.127.8:8080/ws') {
                connection = new SocketConnection(url, callbacks);
            } else if (url === 'ws://193.171.127.8:8081') {
                connection = new SocketIOConnection(url, callbacks);
            } else if (url === 'http://193.171.127.8:8082/api/echo') {
                connection = new RestConnection(url, callbacks)
            }
        break;
        case WORKER_MESSAGES.send:
            connection.send(data.message, data.measurement);
        break;
        case WORKER_MESSAGES.status:
            postFromWorker('status', connection.isClosed());
        break;
        case WORKER_MESSAGES.reconnect:
            connection.reConnect();
        break;
        case WORKER_MESSAGES.close:
            connection.socket.close();
        break;
    }
}, false);

function onMessage(message, delay) {
    postFromWorker(WORKER_MESSAGES.onmessage, message, delay);
}

function onError(err) {
    postFromWorker(WORKER_MESSAGES.onerror, err);
}

function onClose() {
    postFromWorker(WORKER_MESSAGES.onclose);
}

function onOpen() {
    postFromWorker(WORKER_MESSAGES.onopen);
}

function postFromWorker(type, message, delay) {
    self.postMessage(JSON.stringify({ 
        type: type, message: message, delay: delay 
    }));
}