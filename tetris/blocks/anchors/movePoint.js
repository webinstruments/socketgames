function MovingPoint(zIndex, color) {
    var geometry = new THREE.BoxGeometry(0.1, 0.1, zIndex);
    var material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1, color: color });
    this.movePoint = new THREE.Mesh(geometry, material);
    this.position = this.movePoint.position;
}

MovingPoint.prototype.hide = function() {
    this.movePoint.movePoint.material.opacity = 0;
}

MovingPoint.prototype.show = function() {
    this.movePoint.movePoint.material.opacity = 1;
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