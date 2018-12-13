function WireFrame(geometry, color, lineWidth) {
    var wireFrameGeo = new THREE.EdgesGeometry(geometry);
    var wireFrameMat = new THREE.LineBasicMaterial({ color: color, linewidth: lineWidth });
    this.wireframe = new THREE.LineSegments(wireFrameGeo, wireFrameMat);
    this.wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
}

WireFrame.prototype.setPosition = function(x, y, z) {
    this.wireframe.position.set(x, y, z);
}

WireFrame.prototype.hide = function() {
    this.wireframe.visible = false;
}

WireFrame.prototype.show = function() {
    this.wireframe.visible = true;
}

WireFrame.prototype.setTransparent = function(value) {
    this.wireframe.material.transparent = value;
}

WireFrame.prototype.setOpacity = function(value) {
    this.wireframe.material.opacity = value;
}