var cube_id = 0;
function Cube(x, y, length, color, lineColor, parent) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.color = color;
    this.lineColor = lineColor;
    this.parent = parent;
    this.id = ++cube_id;
    this.resize(this.length);
    this.fadeOutTime = 1000;
    this.intervalTime = 20;
    this.fadeOutPercent = 1 * this.intervalTime / this.fadeOutTime;
    this.timer = null;
}

Cube.prototype.resize = function(size) {    
    var cubeGeo = new THREE.BoxGeometry(size, size, size);
    var cubeMat = new THREE.MeshBasicMaterial({ color: this.color });
    this.cube = new THREE.Mesh(cubeGeo, cubeMat);
    this.cube.position.set(this.x, this.y, -size / 2);

    if(this.lineColor != null) {
        this.frame = new WireFrame(cubeGeo, this.lineColor, 4);
        this.cube.add(this.frame.wireframe);
    }
}

Cube.prototype.getPosition = function(world) {
    //results in position of the left top edge
    var cubePosition = new THREE.Vector3();
    cubePosition.setFromMatrixPosition(this.cube.matrixWorld);
    var worldPosition = new THREE.Vector3();
    worldPosition.setFromMatrixPosition(world.matrixWorld);
    cubePosition = cubePosition.sub(worldPosition);
    return {
        leftX: cubePosition.x - this.length / 2, rightX: cubePosition.x + this.length / 2,
        bottomY: cubePosition.y - this.length / 2, topY: cubePosition.y + this.length / 2,
        x: cubePosition.x, y: cubePosition.y
     };
}

Cube.prototype.remove = function() {
    this.cube.material.transparent = true;
    if(this.frame) {
        this.frame.setTransparent(true);
    }
    this.timer = setInterval(this.fadeOut.bind(this), this.intervalTime);
}

Cube.prototype.getParent = function() {
    return this.parent;
}

Cube.prototype.fadeOut = function() {
    this.fadeOutTime -= this.intervalTime;
    if(this.fadeOutTime == 0) {
        this.parent.removeCube(this);
        clearInterval(timer);
    } else {
        this.cube.material.opacity -= this.fadeOutPercent;
        if(this.frame) {
            this.frame.setOpacity(this.cube.material.opacity);
        }
    }
}

Cube.prototype.markedForRemoval = function() {
    return this.timer != null;
}