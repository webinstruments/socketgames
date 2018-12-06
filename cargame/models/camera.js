function Camera(lookAtObj, nearField, farField, posY, distanceFromPlayer) {
    this.lookAtObj = lookAtObj;
    this.nearField = nearField;
    this.farField = farField;
    this.posY = posY;
    this.distanceFromPlayer = distanceFromPlayer; 
    this.camera = this.create();
    this.position = this.camera.position;
    this.move();
}

Camera.prototype.move = function() {
    this.camera.position.z = this.lookAtObj.position.z + this.distanceFromPlayer;
    this.camera.lookAt(this.lookAtObj.position);
    this.position = this.camera.position;
}

Camera.prototype.create = function() {
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, this.nearField, this.farField);
    camera.position.x = 0;
    camera.position.y = this.posY;
    
    return camera;
}

Camera.prototype.update = function() {
    this.move();
}

Camera.prototype.lookAt = function(obj) {
    this.lookAtObj = obj;
    this.move();
}

Camera.prototype.onResize = function() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
}