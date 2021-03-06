var gameGlobals = {
    //index
    scene: null,
    orthoScene: null,
    blockController: null,
    //main
    lastFrameTime: 0,
    frameRate: 16.6667,
    stepValue: 16.6667 / 1000,
    delta: 0,
    requestId: null,
    firstStart: true,
    //controls
    displayController: null,
    released: true,
    paused: false,
    pauseButton: null,
    //hud
    textContainer: null,
    timer: null,
    scoreController: null,
    stats: null,
    control: null,
    version: "1.50",
    //init
    camera: null,
    orthoCamera: null,
    renderer: null,
    //sockets
    socketConnection: null,
    disconnected: false,
    delayOutput: null,
    //startscreen
    formDiv: null,
    formHeadLine: null,
    connectionTypes: [],
    form: null,
    username: null,
    restService: null,
    socketUrl: null,
    socketConnectionId: null,
    formOpened: null,
    connectionTimer: null,
    //pausescreen
    logoElement: null,
    fhLogoElement: null,
    pauseScreen: null,
    tipElement: null,
    tipFirstStart: "You can drag the buttons as you wish.<br>Or you can use the arrow keys of your keyboard.<br>If you are ready press the ► button.",
    tipPause: "Tip: You can drag the buttons.",
    disconnectionText: "You have been disconnected. Trying to reconnect...<br/>If not possible reload the page.",
    connectedText: "Reconnected with the server.<br>If you are ready press the ► button.",
    //scores
    scoreVisible: false,
    //aboutPage
    aboutPage: null,
    aboutButton: null,
    serverSpan: null,
    serverLink: null
}