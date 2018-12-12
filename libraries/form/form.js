function Form(formClass, children, submitText, submitClass, onSubmit) {
    this.domElement = document.createElement('form');
    this.domElement.setAttribute('class', formClass);
    this.domElement.setAttribute('autocomplete', 'off');
    this.submitButton = new Button(submitText, submitClass, this.validate, this);
    this.children = [];
    this.submit = onSubmit;
    this.appendChildren(children);
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
    for(var i = 0; i < this.children.length; ++i) {
        var element = this.children[i];
        if(element.validate && !element.validate()) {
            return false;
        }
    }
    this.submit();
    return false; //no redirect
}