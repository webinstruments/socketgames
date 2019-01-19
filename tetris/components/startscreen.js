var WEBSOCKET_SERVERS = [
    'ws://193.171.127.8:8080/ws',
    'ws://193.171.127.8:8081'
];

function createForm() {
    gameGlobals.formDiv = new DivGroup('centered');
    gameGlobals.formHeadLine = new Header('New Game!', 'noselect');
    gameGlobals.socketUrl = WEBSOCKET_SERVERS[getRandom(1)];

    var userInput = new TextInput({
        name: 'username',
        value: gameGlobals.username || '',
        label: 'username',
        labelClass: 'label noselect', 
        groupClass: 'formgroup'
    });
    var serverInput = new TextInput({
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
        children: [userInput, selection, serverInput],
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
}