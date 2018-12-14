function Label(label, labelClass, forAttr) {
    this.domElement = document.createElement('label');
    if(forAttr) {
        this.domElement.setAttribute('for', forAttr);
    }
    this.domElement.setAttribute('class', labelClass);
    this.domElement.innerText = label;
}