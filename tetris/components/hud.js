function addControls() {
    var gui = new dat.GUI();
    gameGlobals.control = new function () {
        this.gameSpeed = BLOCK_TILES_PER_SECOND;
        this.thresholdTime = BLOCK_THRESHOLDTIME;
        this.block1 = false;
        this.block2 = false;
        this.block3 = false;
        this.block4 = false;
        this.block5 = false;
        this.block6 = false;
        this.block7 = false;
    };
    gui.add(gameGlobals.control, 'gameSpeed', 0, 8);
    gui.add(gameGlobals.control, 'thresholdTime', 0.5, 20000);
    gui.add(gameGlobals.control, 'block1');
    gui.add(gameGlobals.control, 'block2');
    gui.add(gameGlobals.control, 'block3');
    gui.add(gameGlobals.control, 'block4');
    gui.add(gameGlobals.control, 'block5');
    gui.add(gameGlobals.control, 'block6');
    gui.add(gameGlobals.control, 'block7');
    gui.close();
}

function displayGameInfo() {
    gameGlobals.textContainer = new TextContainer('textContainer', [{
        id: 'version',
        label: 'v',
        value: gameGlobals.version
    }, {
        id: 'score',
        label: 'score ',
        value: '0'
    }, {
        id: 'stage',
        label: 'stage ',
        value: '0'
    }, {
        id: 'delay',
        label: 'delay ',
        value: '0'
    }, {
        id: 'rows',
        label: 'rows ',
        value: '0'
    }, {
        id: 'time',
        label: 'time ',
        value: '0'
    }]);
    
    document.body.appendChild(gameGlobals.textContainer.domElement);
}

function initScoreListener() {
    gameGlobals.scoreController = new ScoreController(
        gameGlobals.textContainer.getTextElement('rows'), gameGlobals.textContainer.getTextElement('score'));
}

function startTimer(textElement) {
    gameGlobals.timer = new Timer(textElement);
    gameGlobals.timer.start();
}

function createStats(visible) {
    gameGlobals.stats = new Stats();
    gameGlobals.stats.setMode(0);

    gameGlobals.stats.domElement.style.position = 'absolute';
    gameGlobals.stats.domElement.style.left = '0px';
    gameGlobals.stats.domElement.style.top = '0px';
    document.body.appendChild(gameGlobals.stats.domElement);
    gameGlobals.stats.show = function() {
        this.domElement.style.display = "";
    }
    gameGlobals.stats.hide = function() {
        this.domElement.style.display = "none";
    }
    if(!visible) {
        gameGlobals.stats.hide();
    }
}