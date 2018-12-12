function Label(label, labelClass, forAttr) {
    this.domElement = document.createElement('label');
    this.domElement.setAttribute('for', forAttr);
    this.domElement.setAttribute('class', labelClass);
    this.domElement.innerText = label;
}