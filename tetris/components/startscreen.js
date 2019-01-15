var formDiv;
var formHeadLine;
var form;
var connectionTypes = [];
var username = null;
var restService;
var socketUrl = null;
var socketServers = [
    'ws://193.171.127.8:8080/ws',
    'ws://193.171.127.8:8081'
];

function createForm() {
    formDiv = new DivGroup('centered');
    formHeadLine = new Header('New Game!', 'noselect');
    socketUrl = socketServers[getRandom(1)];

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
        readOnly: true,
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
                if(result.type == 0) {
                    showError("Please select a connection type");
                    return;
                }
                username = result.username;
                console.log(result);
                restService = new RestService(username, result.type, result.server);
                startGame();
        }
    });
    if(!connectionTypes.length) {
        connectionTypes.push({ value: 0, name: "plase choose" })
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