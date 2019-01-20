var WEBSOCKET_SERVERS = [
    'ws://193.171.127.8:8080/ws',
    'ws://193.171.127.8:8081'
];

function reconnectingToServer() {
    if(gameGlobals.socketConnection.connection.isClosed()) {
        gameGlobals.socketConnectionId = 1 - gameGlobals.socketConnectionId; //if server is not accessible
        gameGlobals.socketUrl = WEBSOCKET_SERVERS[gameGlobals.socketConnectionId];
        gameGlobals.serverInput.setText(gameGlobals.socketUrl);
        checkConnection(gameGlobals.socketUrl);
    }
}

function onFormOpen() {
    gameGlobals.formOpened = true;
    gameGlobals.connectionTimer = setInterval(reconnectingToServer, 2000);
}

function onFormClosed() {
    gameGlobals.formOpened = false;
    clearInterval(gameGlobals.connectionTimer);
    gameGlobals.connectionTimer = null;
}

function createForm() {
    gameGlobals.formDiv = new DivGroup('centered', {
        onOpen: onFormOpen,
        onClose: onFormClosed
    });
    gameGlobals.formHeadLine = new Header('New Game!', 'noselect');
    gameGlobals.socketConnectionId = getRandom(1);
    gameGlobals.socketUrl = WEBSOCKET_SERVERS[gameGlobals.socketConnectionId];

    var userInput = new TextInput({
        name: 'username',
        value: gameGlobals.username || '',
        label: 'username',
        labelClass: 'label noselect', 
        groupClass: 'formgroup'
    });
    gameGlobals.serverInput = new TextInput({
        name: 'server', 
        //value: 'ws://demos.kaazing.com/echo',
        //value: 'ws://193.171.127.8:8081',
        value: gameGlobals.socketUrl,
        label: 'echo server',
        labelClass: 'label noselect', 
        groupClass: 'formgroup',
        readOnly: true,
        onFocusOut: checkConnection
    });
    var selection = new Selector({
        name: 'type',
        values: [ { value: -1, name: 'no connection' } ],
        label: 'connection type',
        labelClass: 'label noselect',
        groupClass: 'formgroup',
        btnClass: 'selectButton'
    });
    gameGlobals.form = new Form({
        formClass: 'form',
        children: [userInput, selection, gameGlobals.serverInput],
        submitText: 'start game!',
        submitClass: 'startButton',
            onSubmit: function(result) {
                if(result.type == 0) {
                    showError("Please select a connection type");
                    return;
                }
                gameGlobals.username = result.username;
                console.log(result);
                gameGlobals.restService = new RestService(result.username, result.type, result.server);
                startGame();
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
    checkConnection(gameGlobals.socketUrl);
    setTimeout(onFormOpen, 2000); //else double connecting
}