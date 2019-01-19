function initPause() {
    gameGlobals.logoElement = document.getElementById("logo");
    gameGlobals.pauseScreen = document.getElementById("pausescreen");
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