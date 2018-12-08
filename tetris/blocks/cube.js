function Cube(x, y, length) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.resize(this.length);
}

Cube.prototype.resize = function(size) {    
    var cubeGeo = new THREE.BoxGeometry(size, size, size);
    var cubeMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });

    var wireFrameGeo = new THREE.EdgesGeometry(cubeGeo);
    var wireFrameMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 4 });
    var wireframe = new THREE.LineSegments(wireFrameGeo, wireFrameMat);
    wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
    this.cube = new THREE.Mesh(cubeGeo, cubeMat);
    this.cube.position.set(this.x, this.y, -size / 2);
    this.cube.add(wireframe);
}

Cube.prototype.getPosition = function(world) {
    var position = new THREE.Vector3();
    position.setPositionFromMatrix(this.cube.matrixWorld);
    return position;
}