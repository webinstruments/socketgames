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
}

Cube.prototype.resize = function(size) {    
    var cubeGeo = new THREE.BoxGeometry(size, size, size);
    var cubeMat = new THREE.MeshBasicMaterial({ color: this.color });

    var wireFrameGeo = new THREE.EdgesGeometry(cubeGeo);
    var wireFrameMat = new THREE.LineBasicMaterial({ color: this.lineColor, linewidth: 4 });
    var wireframe = new THREE.LineSegments(wireFrameGeo, wireFrameMat);
    wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
    this.cube = new THREE.Mesh(cubeGeo, cubeMat);
    this.cube.position.set(this.x, this.y, -size / 2);
    this.cube.add(wireframe);
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
    return this.parent.removeCube(this);
}

Cube.prototype.getParent = function() {
    return this.parent;
}