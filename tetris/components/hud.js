var textContainer;
var timer;
var scoreController;
var stats;
var control;

function addControls() {
    var gui = new dat.GUI();
    control = new function () {
        this.gameSpeed = BLOCK_VELOCITY;
        this.thresholdTime = BLOCK_THRESHOLDTIME;
        this.block1 = false;
        this.block2 = false;
    };
    gui.add(control, 'gameSpeed', 0, 8);
    gui.add(control, 'thresholdTime', 0.5, 20000);
    gui.add(control, 'block1');
    gui.add(control, 'block2');
}

function displayGameInfo() {
    textContainer = new TextContainer('textContainer', [{
        id: 'score',
        label: 'Score: ',
        value: '0'
    }, {
        id: 'delay',
        label: 'Delay: ',
        value: '0'
    }, {
        id: 'time',
        label: 'Time: ',
        value: '0'
    }]);
    
    document.body.appendChild(textContainer.domElement);
}

function initScoreListener() {
    scoreController = new ScoreController(textContainer.getTextElement('score'));
}

function startTimer(textElement) {
    timer = new Timer(textElement);
    timer.start();
}

function createStats() {
    stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}