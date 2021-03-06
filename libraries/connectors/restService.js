var REST_NEWGAME_URL = "http://teaching.fh-timing.com:8082/api/game";
var REST_GAMEDATA_URL = "http://teaching.fh-timing.com:8082/api/gamedata";
var REST_ENDGAME_URL = "http://teaching.fh-timing.com:8082/api/game";
var REST_CONNECTIONTYPE_URL = "http://teaching.fh-timing.com:8082/api/connectiontypes";
var REST_SCORE_URL = "http://teaching.fh-timing.com:8082/api/ranking";

function RestService(username, connectionType, socketServer) {
    this.game = null;
    if(username && connectionType && socketServer) {
        this.start(username, connectionType, socketServer);
    }
    this.delays = [];
    this.delaysToRemove = 0;
    this.connectionTimer = null;
}

RestService.getConnections = function(dataCallback) {
    RestService.getCall(REST_CONNECTIONTYPE_URL, dataCallback, function(info, options, error) {
        showError("Couldn't retrieve connection items. Reload the page.");
        console.warn(error);
    });
}

RestService.getRankings = function(dataCallback) {
    RestService.getCall(REST_SCORE_URL, dataCallback, function(info, options, error) {
        showError("Couldn't ranking connection items.");
        console.warn(error);
    });
}

RestService.getCall = function(url, okCallback, errorCallback) {
    $.ajax({
        type: "GET",
        url: url,
        success: okCallback,
        error: errorCallback
    });
}

RestService.prototype.start = function(username, connectionType, socketServer) {
    var self = this;
    $.ajax({
        type: "POST",
        url: REST_NEWGAME_URL,
        data: {
            username: username,
            con_type: connectionType,
            websocket_server: socketServer
        },
        success: function(data) {
            //showInfo("Connection to information server successfull");
            console.log('received:', data);
            if(data && data.game_id) {
                self.game = {
                    game_id: data.game_id,
                    con_id: connectionType
                };
                clearInterval(self.connectionTimer);
                self.connectionTimer = null;
            } else {
                showError("no game id received");
                console.warn("no data received");
                self.startTimer(10000, username, connectionType, socketServer);
            }
        },
        error: function(info, options, error) {
            showError("Connection to information server failed");
            console.warn(error);
            self.startTimer(10000, username, connectionType, socketServer);
        }
    });
}

RestService.prototype.startTimer = function(interval, username, connectionType, socketServer) {
    if(!this.connectionTimer) {
        interval = !interval ? 10000 : interval;
        this.connectionTimer = setInterval(this.start.bind(this), interval, username, connectionType, socketServer);
    }
}

RestService.prototype.saveData = function() {
    if(!this.game) { return; }
    var self = this;
    this.delaysToRemove = this.delays.length;
    $.ajax({
        headers: {
            'Content-Type':'application/json'
        },
        type: "POST",
        url: REST_GAMEDATA_URL,
        data: JSON.stringify(self.delays),
        success: function() {
            self.delays.splice(0, self.delaysToRemove);
            self.delaysToRemove = 0;
        },
        error: function(info, options, error) {
            showError("Send data failed");
            console.warn(error);
        }
    });
}

RestService.prototype.end = function(score) {
    if(!this.game) { return; }
    var self = this;
    this.saveData();
    $.ajax({
        type: "PUT",
        url: REST_ENDGAME_URL,
        data: { 
            game_id: self.game.game_id, score: score 
        },
        success: function(data) {
            this.game = null;
            showInfo("Game successfully saved");
        },
        error: function(info, options, error) {
            showError("Game couldn't be saved");
            console.warn(error);
        } 
    });
}

RestService.prototype.addDelay = function(delay) {
    if(!this.game) { return; }
    this.delays.push({ game_id: this.game.game_id, roundtrip_time: delay });
    if(this.delays.length % 20 == 0) {
        this.saveData();
    }
}