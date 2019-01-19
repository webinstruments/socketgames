var gameGlobals = {
    //index
    scene: null,
    orthoScene: null,
    blockController: null,
    //main
    lastFrameTime: 0,
    frameRate: 16.6667,
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
    version: "1.14",
    //init
    camera: null,
    orthoCamera: null,
    renderer: null,
    //sockets
    socketConnection: null,
    //startscreen
    formDiv: null,
    formHeadLine: null,
    connectionTypes: [],
    form: null,
    username: null,
    restService: null,
    socketUrl: null,
    //pausescreen
    logoElement: null,
    pauseScreen: null
}