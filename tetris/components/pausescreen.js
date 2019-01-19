function initPause() {
    gameGlobals.logoElement = document.getElementById("logo");
    gameGlobals.pauseScreen = document.getElementById("pausescreen");
    gameGlobals.tipElement = document.getElementById("tip");
}

function showPause() {
    gameGlobals.pauseScreen.style.display = "";
    showLogo();
}

function hidePause() {
    gameGlobals.pauseScreen.style.display = "none";
    hideLogo();
}

function showLogo() {
    gameGlobals.logoElement.style.display = "";
}

function hideLogo() {
    gameGlobals.logoElement.style.display = "none";
}

function setFirstStartText() {
    gameGlobals.tipElement.innerHTML = gameGlobals.tipFirstStart;
}

function setPauseText() {
    gameGlobals.tipElement.innerHTML = gameGlobals.tipPause;
}

function setDisconnectionText() {
    gameGlobals.tipElement.innerHTML = gameGlobals.disconnectionText;
}

function setConnectedText() {
    gameGlobals.tipElement.innerHTML = gameGlobals.connectedText;
}