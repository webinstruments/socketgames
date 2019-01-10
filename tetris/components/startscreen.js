var formDiv;
var formHeadLine;
var form;
var connectionTypes = [];
var username = null;
var restService;
var socketUrl = null;

function createForm() {
    formDiv = new DivGroup('centered');
    formHeadLine = new Header('New Game!', 'noselect');
    socketUrl = socketUrl || 'ws://193.171.127.8:8080/ws';

    var userInput = new TextInput({
        name: 'username',
        value: username || '',
        label: 'Enter username',
        labelClass: 'label noselect', 
        groupClass: 'formgroup'
    });
    var serverInput = new TextInput({
        name: 'server', 
        //value: 'ws://demos.kaazing.com/echo',
        //value: 'ws://193.171.127.8:8081',
        value: socketUrl,
        label: 'Enter echo server',
        labelClass: 'label noselect', 
        groupClass: 'formgroup',
        onFocusOut: checkConnection
    });
    var selection = new Selector({
        name: 'type',
        values: [ { value: -1, name: 'no connection' } ],
        label: 'Choose type',
        labelClass: 'label noselect',
        groupClass: 'formgroup',
        btnClass: 'selectButton'
    });
    form = new Form({
        formClass: 'form',
        children: [userInput, serverInput, selection],
        submitText: 'start game!',
        submitClass: 'startButton',
            onSubmit: function(result) {
                username = result.username;
                socketUrl = result.server;
                console.log(result);
                restService = new RestService(username, result.type);
                startGame();
        }
    });
    if(!connectionTypes.length) {
        RestService.getConnections(function(data) {
            data.forEach(function(d) {
                connectionTypes.push({ value: d.id, name: d.type });
                selection.setValues(connectionTypes);
            });
        });
    }
    formDiv.domElement.appendChild(formHeadLine.domElement);
    formDiv.domElement.appendChild(form.domElement);
    document.body.appendChild(formDiv.domElement);
    //form.disable();
    checkConnection(socketUrl);
}