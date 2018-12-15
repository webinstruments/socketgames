var socketConnection;

function checkConnection(url) {
    if(!socketConnection) {
        socketConnection = new SocketConnection(url, 
            textContainer.getTextElement('delay'), {
            onOpen: socketOnOpen,
            onMessage: moveRemote,
            onError: socketOnError,
            onClose: socketOnClose
        });
    } else if(socketConnection.getUrl() != url) {
        socketConnection.connect(url);
    }
}

function socketOnOpen() {
    form.setInfoText("Connection Successfull");
    form.enable();
}

function socketOnMessage(msg) {
}

function socketOnError(err) {
    var errorMsg = 'Error: ';
    if(err) {
        errorMsg += err;
    } else {
        errorMsg += 'The provided Url is not valid';
    }
    form.setInfoText(errorMsg);
}

function socketOnClose() {
    form.setInfoText("Connection Closed");
}