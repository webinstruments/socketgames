var REST_NEWGAME_URL = "http://213.47.38.104:8080/api/game";
var REST_GAMEDATA_URL = "http://213.47.38.104:8080/api/gamedata";
var REST_ENDGAME_URL = "http://213.47.38.104:8080/api/game";
var REST_CONNECTIONTYPE_URL = "http://213.47.38.104:8080/api/connectiontypes";

function RestService(username, connectionType) {
    this.game = null;
    if(username && connectionType) {
        this.start(username, connectionType);
    }
    this.delays = [];
    this.delaysToRemove = 0;
}

RestService.getConnections = function(dataCallback) {
    $.ajax({
        type: "GET",
        url: REST_CONNECTIONTYPE_URL,
        success: dataCallback,
        error: function(info, options, error) {
            showError("Couldn't retrieve connection items");
            console.warn(error);
        }
    });
}

RestService.prototype.start = function(username, connectionType) {
    var self = this;
    $.ajax({
        type: "POST",
        url: REST_NEWGAME_URL,
        data: {
            username: username,
            con_type: connectionType
        },
        success: function(data) {
            showInfo("Connection to information server successfull");
            self.game = {
                game_id: data[0].game_id,
                con_id: connectionType
            };
        },
        error: function(info, options, error) {
            showError("Connection to information server failed");
            console.warn(error);
        }
    });
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

RestService.prototype.end = function() {
    if(!this.game) { return; }
    var self = this;
    this.saveData();
    $.ajax({
        type: "PUT",
        url: "http://213.47.38.104:8080/api/game",
        data: self.game,
        success: function(data) {
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