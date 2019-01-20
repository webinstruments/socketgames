function DivGroup(divClass, callbacks) {
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('class', divClass);
    this.onOpen = null;
    this.onClose = null;
    if(callbacks) {
        this.onOpen = callbacks.onOpen;
        this.onClose = callbacks.onClose;
    }
}

DivGroup.prototype.appendChild = function(domElement) {
    this.domElement.appendChild(domElement);
}

DivGroup.prototype.show = function() {
    var styles = this.domElement.getAttribute('style').replace(' ', '').replace('display:none', '');
    if(styles == null) {
        this.domElement.removeAttribute('style');
    } else {
        this.domElement.setAttribute('style', styles);
    }
    if(this.onOpen) {
        this.onOpen();
    }
}

DivGroup.prototype.hide = function() {
    var styles = this.domElement.getAttribute('style');
    if(styles) {
        styles += ';';
    } else {
        styles = '';
    }
    this.domElement.setAttribute('style', styles + 'display:none');
    if(this.onClose) {
        this.onClose();
    }
}