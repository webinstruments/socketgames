function Button(value, btnClass, clickCB, binder) {
    this.domElement = document.createElement('input');
    this.domElement.setAttribute('type', 'button');
    this.domElement.setAttribute('class', btnClass);
    this.domElement.setAttribute('value', value);
    if(clickCB) {
        this.domElement.addEventListener('click', clickCB.bind(binder));
    }
}