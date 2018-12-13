function QuadBlock(cubeLength) {
    this.length = cubeLength;
    this.cubes = [];
    this.bottomCubes = [];
    this.velocity = 1;
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

    this.cubes.push(new Cube(-this.length, 0, this.length, 0xffaa00, 0x000000, this));
    this.cubes.push(new Cube(0, 0, this.length, 0xffaa00, 0x000000, this));
    this.cubes.push(new Cube(-this.length, -this.length, this.length, 0xffaa00, 0x000000, this));
    this.cubes.push(new Cube(0, -this.length, this.length, 0xffaa00, 0x000000, this));

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

QuadBlock.prototype.getLeftBlocks = function() {
    return [ this.cubes[0], this.cubes[2] ];
}

QuadBlock.prototype.getRightBlocks = function() {
    return [ this.cubes[1], this.cubes[3] ];
}

QuadBlock.prototype.getBottomBlocks = function() {
    return this.bottomCubes;
}

QuadBlock.prototype.setPosition = function(x, y) {
    this.movePoint.position.set(x, y, this.length);
}

QuadBlock.prototype.getPosition = function() {
    return this.movePoint.position;
}

QuadBlock.prototype.isEmpty = function() {
    return this.cubes.length == 0 || this.cubes.filter(function(cube) {
        return cube.markedForRemoval();
    }).length == this.cubes.length;
}

QuadBlock.prototype.moveDown = function(deltaTime) {
    this.movePoint.position.y -= deltaTime * BLOCK_VELOCITY * this.velocity;
}

QuadBlock.prototype.moveLeft = function() {
    this.movePoint.position.x -= this.length;
}

QuadBlock.prototype.moveFast = function() {
    this.velocity = 5;
}

QuadBlock.prototype.moveRight = function() {
    this.movePoint.position.x += this.length;
}

QuadBlock.prototype.removeCube = function(cube) {
    var foundIndex = -1;
    for(var i = 0; i < this.cubes.length; ++i) {
        if(this.cubes[i].id == cube.id) {
            foundIndex = i;
            this.group.remove(this.cubes[i].cube);
            break;
        }
    }
    this.cubes.splice(foundIndex, 1);
    if(this.cubes.length == 0) {
        this.remove();
        return true;
    }
    return false;
}

QuadBlock.prototype.rotate = function() {
    //this.pivot.rotation.z += Math.PI / 2;
}

QuadBlock.prototype.remove = function() {
    while(this.cubes.length) {
        var c = this.cubes.pop();
    }
    this.movePoint.parent.remove(this.movePoint);
}