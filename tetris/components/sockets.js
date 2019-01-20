var GAME_NAME = 'game_Tetris';

function checkConnection(url) {
    if(!gameGlobals.socketConnection) {
        gameGlobals.socketConnection = new ConnectionManager(url, {
            onOpen: socketOnOpen,
            onMessage: socketOnMessage,
            onError: socketOnError,
            onClose: socketOnClose
        }, gameGlobals.textContainer.getTextElement('delay'));
    } else if(gameGlobals.socketConnection.getUrl() != url) {
        gameGlobals.socketConnection.connect(url);
    }
}

function socketOnOpen() {
    gameGlobals.form.setInfoText("");
    gameGlobals.socketConnection.send(GAME_NAME, false);
    gameGlobals.form.enable();
    if(gameGlobals.disconnected) {
        handleReconnection();
    }
}

function socketOnMessage(msg, delay) {
    //console.log(msg);
    moveRemote(msg);
    if(delay && gameGlobals.restService) {
        gameGlobals.restService.addDelay(delay);
    }
}

function socketOnError(err) {
    var errorMsg = 'Error: ';
    if(err) {
        errorMsg += err;
    } else {
        errorMsg += 'Connection not successfull. Please reload page.';
    }
    gameGlobals.form.setInfoText(errorMsg);
    gameGlobals.form.disable();
}

function socketOnClose() {
    gameGlobals.form.setInfoText("Connection Closed");
    gameGlobals.form.disable();
}

function handleReconnection() {
    gameGlobals.disconnected = false;
    showInfo("Reconnected");
    setConnectedText();
}

function handleDisconnection() {
    gameGlobals.disconnected = true;
    showError("Disconnected from server. Reconnecting...");
    pauseGame();
    setDisconnectionText();
    gameGlobals.socketConnection.connection.reConnect();
}