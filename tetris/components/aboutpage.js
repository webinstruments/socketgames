function initAboutPage() {
    gameGlobals.aboutPage = document.getElementById("aboutPage");
    gameGlobals.serverSpan = document.getElementById("serverConnection");
    gameGlobals.aboutButton = document.getElementById("aboutButton");
}

function showAboutPage() {
    gameGlobals.aboutPage.style.display = "";
    gameGlobals.serverSpan.innerHTML = gameGlobals.socketUrl;
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