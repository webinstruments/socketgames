function MovingPoint(zIndex, color) {
    var geometry = new THREE.BoxGeometry(0.1, 0.1, zIndex);
    var material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1, color: color });
    this.movePoint = new THREE.Mesh(geometry, material);
    this.position = this.movePoint.position;
}

MovingPoint.prototype.hide = function() {
    this.movePoint.visible = false;
}

MovingPoint.prototype.show = function() {
    this.movePoint.visible = true;
}

MovingPoint.prototype.add = function(children) {
    this.movePoint.add(children);
}

MovingPoint.prototype.setPosition = function(x, y, z) {
    this.movePoint.position.set(x, y, z);
}

MovingPoint.prototype.getPosition = function() {
    return this.movePoint.position;
}

MovingPoint.prototype.remove = function() {
    this.movePoint.parent.remove(this.movePoint);
}