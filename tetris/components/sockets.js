var GAME_NAME = 'game_Tetris';

function checkConnection(url, workerPath) {
    if(!gameGlobals.socketConnection) {
        gameGlobals.delayOutput = gameGlobals.textContainer.getTextElement('delay');
        var worker = new Worker(workerPath);
        gameGlobals.socketConnection = new ConnectionManager(url, {
            onOpen: socketOnOpen,
            onMessage: socketOnMessage,
            onError: socketOnError,
            onClose: socketOnClose
        }, worker);
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
    moveRemote(msg);
    if(delay && gameGlobals.restService) {
        gameGlobals.delayOutput.innerHTML = delay + 'ms';
        gameGlobals.restService.addDelay(delay);
    }
}

function socketOnError(err) {
    var errorMsg = 'Error: ';
    if(err) {
        errorMsg += err;
    } else {
        errorMsg += 'Connection not successfull. Reconnecting...';
    }
    if(gameGlobals.formOpened) {
        onFormOpen();
    }
    gameGlobals.form.setInfoText(errorMsg);
    gameGlobals.form.disable();
}

function socketOnClose() {
    gameGlobals.form.setInfoText("Connection Closed");
    gameGlobals.form.disable();
    if(gameGlobals.formOpened) {
        onFormOpen();
    }
}

function handleReconnection() {
    gameGlobals.disconnected = false;
    showInfo("Reconnected");
    setConnectedText();
}

function handleDisconnection(disconnected) {
    if(disconnected) {
        gameGlobals.disconnected = true;
        showError("Disconnected from server. Reconnecting...");
        setDisconnectionText();
        gameGlobals.socketConnection.reConnect();
    }
}