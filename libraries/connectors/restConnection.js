function RestConnection(url, callbacks, output) {
    this.callbacks = callbacks;
    iConnection.call(this, url, callbacks.onMessage, output);
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

RestConnection.prototype.connect = function() {
    if(this.callbacks.onOpen) {
        this.callbacks.onOpen();
    }
}