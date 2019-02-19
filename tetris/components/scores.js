function buildScoreBoard(data) {
    var table = document.getElementById("scoreTable").children[0]; //tbody
    for(var i = 0; i < data.length; ++i) {
        var row = table.children[i + 1];
        row.children[1].innerHTML = data[i].user;
        row.children[2].innerHTML = data[i].score;
    }
}

function toggleScoreBoard() {
    var container = document.getElementById("scoreContainer");
    var btn = document.getElementById("scoreButton");
    if(gameGlobals.scoreBoardVisible) {
        container.style.display = "none";
        btn.value = "Scores";
        showAboutButton();
    } else {
        RestService.getRankings(buildScoreBoard);
        container.style.display = "block";
        btn.value = "Main menu";
        hideAboutButton();
    }
    gameGlobals.scoreBoardVisible = !gameGlobals.scoreBoardVisible;
}

function hideScoreButton() {
    document.getElementById("scoreButton").style.display = "none";
}

function showScoreButton() {
    document.getElementById("scoreButton").style.display = "";
}