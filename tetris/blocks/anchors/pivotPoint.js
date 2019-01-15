function PivotPoint(zIndex, color, visible) {
    var geometry = new THREE.BoxGeometry(0.1, 0.1, zIndex);
    var material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 1 });
    this.pivot = new THREE.Mesh(geometry, material);
    this.rotation = this.pivot.rotation;
    this.position = this.pivot.position;
    if(!visible) {
        this.hide();
    }
}

PivotPoint.prototype.rotateZ = function(angle) {
    this.pivot.rotation.z = angle;
}

PivotPoint.prototype.hide = function() {
    this.pivot.material.opacity = 0;
}

PivotPoint.prototype.show = function() {
    this.pivot.material.opacity = 1;
}

PivotPoint.prototype.add = function(children) {
    this.pivot.add(children);
}

PivotPoint.prototype.setPosition = function(x, y, z) {
    this.pivot.position.set(x, y, z);
}