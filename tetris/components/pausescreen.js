function initPause() {
    gameGlobals.logoElement = document.getElementById("logo");
    gameGlobals.pauseScreen = document.getElementById("pausescreen");
    gameGlobals.tippElement = document.getElementById("tipp");
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
    gameGlobals.tippElement.innerHTML = gameGlobals.tippFirstStart;
}

function setPauseText() {
    gameGlobals.tippElement.innerHTML = gameGlobals.tippPause;
}

function setDisconnectionText() {
    gameGlobals.tippElement.innerHTML = gameGlobals.disconnectionText;
}

function setConnectedText() {
    gameGlobals.tippElement.innerHTML = gameGlobals.connectedText;
}