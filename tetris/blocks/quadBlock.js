function QuadBlock(cubeLength) {
    this.length = cubeLength;
    this.cubes = [];
    this.bottomCubes = [];
    console.log('blockSize', this.length);
}

QuadBlock.prototype.generate = function(scene) {
    var self = this;
    this.group = new THREE.Object3D();

    var pivotGeo = new THREE.BoxGeometry(0.1, 0.1, this.length + this.length * 1 / 100);
    var pivotMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1 });
    this.pivot = new THREE.Mesh(pivotGeo, pivotMat);
    this.pivot.transparent = true;
    scene.add(this.pivot); //anchor FIRST!
    //this.anchor.add(this.rotPoint);

    var moveGeo = new THREE.BoxGeometry(0.1, 0.1, this.length + this.length * 1 / 100);
    var moveMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1, color: 0xff0000 });
    this.movePoint = new THREE.Mesh(moveGeo, moveMat);
    this.movePoint.transparent = true;
    scene.add(this.movePoint); //anchor FIRST!
    this.movePoint.add(this.pivot);

    this.cubes.push(new Cube(-this.length, 0, this.length, 0xffaa00, 0x000000));
    this.cubes.push(new Cube(0, 0, this.length, 0xffaa00, 0x000000));
    this.cubes.push(new Cube(-this.length, -this.length, this.length, 0xffaa00, 0x000000));
    this.cubes.push(new Cube(0, -this.length, this.length, 0xffaa00, 0x000000));

    this.cubes.map(function(c) {
        self.group.add(c.cube);
    });
    scene.add(this.group);
    this.pivot.add(this.group);

    //this.quadGroup.translateX(this.length / 2);
    this.boundingBox = new THREE.Box3().setFromObject(this.group);
    this.width = this.boundingBox.max.x - this.boundingBox.min.x;
    this.height = this.boundingBox.max.y - this.boundingBox.min.y;

    this.pivot.position.set(this.length, this.length, this.length);
    this.group.position.x = this.length / 2;
    this.group.position.y = this.length / 2;

    this.bottomCubes.push(this.cubes[2]); //leftBottom
    this.bottomCubes.push(this.cubes[3]); //rightBottom

    return this;
}

QuadBlock.prototype.getLeftBlock = function() {
    return this.bottomCubes[0];
}

QuadBlock.prototype.getRightBlock = function() {
    return this.bottomCubes[1];
}

QuadBlock.prototype.setPosition = function(x, y) {
    this.movePoint.position.set(x, y, this.length);
}

QuadBlock.prototype.getPosition = function() {
    return this.movePoint.position;
}

QuadBlock.prototype.moveDown = function(deltaTime, checkCB, worldScene) {
    this.movePoint.position.y -= deltaTime * 4;
}

QuadBlock.prototype.moveLeft = function() {
    this.movePoint.position.x -= this.length;
}

QuadBlock.prototype.moveRight = function() {
    this.movePoint.position.x += this.length;
}

QuadBlock.prototype.rotate = function() {
    //this.pivot.rotation.z += Math.PI / 2;
}