function Header(value, headerClass) {
    this.domElement = document.createElement('h2');
    if(headerClass) {
        this.domElement.setAttribute('class', headerClass);
    }
    if(value) {
        this.setText(value);
    }
}

Header.prototype.setText = function(text) {
    this.domElement.innerHTML = text;
}