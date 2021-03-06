var WEBSOCKET_SERVERS = [
    'ws://193.171.127.8:8080/ws',
    'ws://193.171.127.8:8081',
    'http://193.171.127.8:8082/api/echo'
];

function checkIfClosed() {
    gameGlobals.socketConnection.isClosed(reconnectingToServer);
}

function reconnectingToServer(disconnected) {
    if(disconnected) {
        gameGlobals.socketConnectionId = 1 - gameGlobals.socketConnectionId; //if server is not accessible
        gameGlobals.socketUrl = WEBSOCKET_SERVERS[gameGlobals.socketConnectionId];
        setSocketUrl(gameGlobals.socketUrl);
        checkConnection(gameGlobals.socketUrl);
    } else {
        clearConnectionTimer();
    }
}

function onFormOpen() {
    gameGlobals.formOpened = true;
    if(!gameGlobals.connectionTimer) {
        gameGlobals.connectionTimer = setInterval(checkIfClosed, 1000);
    }
}

function onFormClosed() {
    gameGlobals.formOpened = false;
    clearConnectionTimer();
}

function clearConnectionTimer() {
    clearInterval(gameGlobals.connectionTimer);
    gameGlobals.connectionTimer = null;
}

function createForm(connectionId, workerPath) {
    gameGlobals.formDiv = new DivGroup('centered', {
        onOpen: onFormOpen,
        onClose: onFormClosed
    });
    gameGlobals.formHeadLine = new Header('New Game!', 'noselect');
    gameGlobals.socketConnectionId = getRandom(1);
    if(connectionId) {
        gameGlobals.socketConnectionId = connectionId;
    }
    gameGlobals.socketUrl = WEBSOCKET_SERVERS[gameGlobals.socketConnectionId];

    var userInput = new TextInput({
        name: 'username',
        value: gameGlobals.username || '',
        label: 'username',
        labelClass: 'label noselect', 
        groupClass: 'formgroup'
    });
    var selection = new Selector({
        name: 'type',
        values: [ { value: -1, name: 'Please reload page' } ],
        label: 'connection type',
        labelClass: 'label noselect',
        groupClass: 'formgroup',
        inputClass: "noselect",
        btnClass: 'selectButton noselect'
    });
    gameGlobals.form = new Form({
        formClass: 'form',
        children: [userInput, selection],
        submitText: 'start game!',
        submitClass: 'button startButton',
            onSubmit: function(result) {
                if(result.type == 0) {
                    showError("Please select a connection type");
                    return;
                }
                gameGlobals.username = result.username;
                console.log(result);
                gameGlobals.restService = new RestService(result.username, result.type, gameGlobals.socketUrl);
                startGame();
                hideAboutButton();
        }
    });
    if(!gameGlobals.connectionTypes.length) {
        gameGlobals.connectionTypes.push({ value: 0, name: "please choose" })
        RestService.getConnections(function(data) {
            data.forEach(function(d) {
                gameGlobals.connectionTypes.push({ value: d.id, name: d.type });
                selection.setValues(gameGlobals.connectionTypes);
            });
        });
    }
    gameGlobals.formDiv.domElement.appendChild(gameGlobals.formHeadLine.domElement);
    gameGlobals.formDiv.domElement.appendChild(gameGlobals.form.domElement);
    document.body.appendChild(gameGlobals.formDiv.domElement);
    //gameGlobals.form.disable();
    checkConnection(gameGlobals.socketUrl, workerPath);
    setTimeout(onFormOpen, 2000); //else double connecting
}