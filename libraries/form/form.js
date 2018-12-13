function Form(options) {
    this.domElement = document.createElement('form');
    if(options.formClass) {
        this.domElement.setAttribute('class', options.formClass);
    }
    this.domElement.setAttribute('autocomplete', 'off');
    this.submitButton = new Button(options.submitText, options.submitClass, this.validate, this);
    this.children = [];
    this.submit = options.onSubmit;
    this.appendChildren(options.children);
    this.appendChildren(this.submitButton);
}

Form.prototype.appendChildren = function(children) {
    if(Array.isArray(children)) {
        var self = this;
        children.map(function(element) {
            self.children.push(element);
            self.domElement.appendChild(element.domElement);
        });
    } else {
        this.domElement.appendChild(children.domElement);
        this.children.push(children);
    }
}

Form.prototype.validate = function() {
    var result = [];
    for(var i = 0; i < this.children.length; ++i) {
        var element = this.children[i];
        if(element.validate && !element.validate()) {
            return false;
        }
        if(element.getValue) {
            result.push('"' + element.name + '":"' + element.getValue() + '"');
        }
    }
    //build object
    result = '{' + result.join(',') + '}';
    this.submit(JSON.parse(result));
    return false; //no redirect
}

Form.prototype.disable = function() {
    this.submitButton.disable();
}

Form.prototype.enable = function() {
    this.submitButton.enable();
}

Form.prototype.setInfoText = function(msg) {
    if(!this.infoText) {
        this.infoText = document.createElement('span');
        this.infoText.setAttribute('style', 'display:block;margin-top:10px;');
        this.domElement.appendChild(this.infoText);
    }
    this.infoText.innerHTML = msg;
}