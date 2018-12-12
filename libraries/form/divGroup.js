function DivGroup(divClass) {
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('class', divClass);
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
}

DivGroup.prototype.hide = function() {
    var styles = this.domElement.getAttribute('style');
    this.domElement.setAttribute('style', styles += ';display:none');
}