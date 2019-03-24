function RestConnection(url, callbacks) {
    this.callbacks = callbacks;
    iConnection.call(this, url, callbacks.onMessage);
}

RestConnection.prototype = Object.create(iConnection.prototype);

RestConnection.prototype.sendMessage = function(message) {
    var self = this;
    $.ajax({ //start new game
        type: "POST",
        url: this.url,
        data: { message: message }
    }).done(function(response) {
        self.onMessage(response);
    });
}