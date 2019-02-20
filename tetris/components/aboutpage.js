function initAboutPage() {
    gameGlobals.aboutPage = document.getElementById("aboutPage");
    gameGlobals.serverSpan = document.getElementById("serverConnection");
    gameGlobals.aboutButton = document.getElementById("aboutButton");
    gameGlobals.serverLink = document.getElementById("serverLink");
}

function showAboutPage() {
    gameGlobals.aboutPage.style.display = "";
    setSocketUrl(gameGlobals.socketUrl);
    hideScoreButton();
    hideAboutButton();
}

function hideAboutPage() {
    gameGlobals.aboutPage.style.display = "none";
    showScoreButton();
    showAboutButton();
}

function showAboutButton() {
    gameGlobals.aboutButton.style.display = "";
}

function hideAboutButton() {
    gameGlobals.aboutButton.style.display = "none";
}

function setSocketUrl(socketUrl) {
    gameGlobals.serverSpan.innerHTML = socketUrl;
    var refUrl = "http" + socketUrl.replace(new RegExp("ws", "g"), "");
    serverLink.setAttribute("href", refUrl);
}