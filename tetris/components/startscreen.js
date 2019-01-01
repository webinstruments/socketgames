var formDiv;
var formHeadLine;
var form;

function createForm() {
    formDiv = new DivGroup('centered');
    formHeadLine = new Header('New Game!', 'noselect');
    var serverInput = new TextInput({
        name: 'server', 
        //value: 'ws://demos.kaazing.com/echo',
        //value: 'ws://193.171.127.8:8081',
        value: 'ws://193.171.127.8:8080/ws',
        label: 'Enter echo server',
        labelClass: 'label noselect', 
        groupClass: 'formgroup',
        onFocusOut: checkConnection
    });
    var selection = new Selector({
        name: 'type',
        values: [
            { value: 0, name: 'WLAN' },
            { value: 1, name: 'LAN' },
            { value: 2, name: '2G' },
            { value: 3, name: '3G' },
            { value: 4, name: '4G' },
        ],
        label: 'Choose type',
        labelClass: 'label noselect',
        groupClass: 'formgroup',
        btnClass: 'selectButton'
    });
    form = new Form({
        formClass: 'form',
        children: [serverInput, selection],
        submitText: 'start game!',
        submitClass: 'startButton',
            onSubmit: function(result) {
            // call the render function
            startGame();
        }
    });
    formDiv.domElement.appendChild(formHeadLine.domElement);
    formDiv.domElement.appendChild(form.domElement);
    document.body.appendChild(formDiv.domElement);
    form.disable();
}