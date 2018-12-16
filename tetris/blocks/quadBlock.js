function QuadBlock(cubeLength) {
    this.length = cubeLength;
    this.cubes = [];
    this.velocity = 1;
}

QuadBlock.prototype.generate = function(scene) {
    var self = this;

    var zIndex = this.length;
    this.movePoint = new MovingPoint(zIndex * 2, 0xff0000);
    this.pivot = new PivotPoint(zIndex, 0xffffff);
    this.movePoint.add(this.pivot.pivot);
    scene.add(this.movePoint.movePoint);

    this.group = new THREE.Object3D();
    var color = 0xffaa00;
    this.cubes.push(new Cube(-this.length, 0, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(0, 0, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(-this.length, -this.length, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(0, -this.length, this.length, color, 0x000000, this));

    this.cubes.map(function(c) {
        self.group.add(c.cube);
    });
    scene.add(this.group);
    this.pivot.add(this.group);

    this.boundingBox = new THREE.Box3().setFromObject(this.group);
    this.width = this.boundingBox.max.x - this.boundingBox.min.x;
    this.height = this.boundingBox.max.y - this.boundingBox.min.y;

    this.pivot.setPosition(this.length, this.length, 0);
    this.group.position.x = this.length / 2;
    this.group.position.y = this.length / 2;

    return this;
}

QuadBlock.prototype.setPosition = function(x, y) {
    this.movePoint.setPosition(x, y, 0);
}

QuadBlock.prototype.getPosition = function() {
    return this.movePoint.getPosition();
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

QuadBlock.prototype.getRotation = function() {
    return 0;
}

QuadBlock.prototype.remove = function() {
    while(this.cubes.length) {
        var c = this.cubes.pop();
    }
    this.movePoint.remove();
}