var socketConnection;
var GAME_NAME = 'game_Tetris';

function checkConnection(url) {
    if(!socketConnection) {
        socketConnection = new ConnectionManager(url, {
            onOpen: socketOnOpen,
            onMessage: socketOnMessage,
            onError: socketOnError,
            onClose: socketOnClose
        }, textContainer.getTextElement('delay'));
    } else if(socketConnection.getUrl() != url) {
        socketConnection.connect(url);
    }
}

function socketOnOpen() {
    form.setInfoText("Connection Successfull");
    socketConnection.send(GAME_NAME, false);
    form.enable();
}

function socketOnMessage(msg) {
    //console.log(msg);
    moveRemote(msg);
}

function socketOnError(err) {
    var errorMsg = 'Error: ';
    if(err) {
        errorMsg += err;
    } else {
        errorMsg += 'The provided Url is not valid';
    }
    form.setInfoText(errorMsg);
    form.disable();
}

function socketOnClose() {
    form.setInfoText("Connection Closed");
    form.disable();
}