function Block2(length) {
    this.length = length;
    this.cubes = [];
    this.velocity = 1;
}

Block2.prototype.generate = function(scene) {
    var self = this;

    var zIndex = this.length;
    this.movePoint = new MovingPoint(zIndex * 2, 0xff0000);
    this.pivot = new PivotPoint(zIndex, 0xffffff);
    this.movePoint.add(this.pivot.pivot);
    scene.add(this.movePoint.movePoint);

    this.group = new THREE.Object3D();
    var color = 0xff00aa;
    this.cubes.push(new Cube(0, 2 * this.length, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(0, this.length, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(0, 0, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(-this.length, 0, this.length, color, 0x000000, this));

    this.cubes.map(function(c) {
        self.group.add(c.cube);
    });
    scene.add(this.group);
    this.pivot.add(this.group);

    this.updateBox();
    
    //Höhe und Breite werden subtrahiert, da der pivot höher liegt
    this.group.position.x = -this.boundingBox.min.x - this.width / 2;
    this.group.position.y = -this.boundingBox.min.y - this.height / 2;
  
    return this;
}

Block2.prototype.updateBox = function() {
    this.boundingBox = new THREE.Box3().setFromObject(this.pivot.pivot);
    this.width = this.boundingBox.max.x - this.boundingBox.min.x;
    this.height = this.boundingBox.max.y - this.boundingBox.min.y;

    var position = this.getPosition();
    this.pivot.setPosition(this.width / 2, this.height / 2, 0);
}

Block2.prototype.setPosition = function(x, y) {
    this.movePoint.setPosition(x, y, 0);
}

Block2.prototype.getPosition = function() {
    return this.movePoint.getPosition();
}

Block2.prototype.isEmpty = function() {
    return this.cubes.length == 0 || this.cubes.filter(function(cube) {
        return cube.markedForRemoval();
    }).length == this.cubes.length;
}

Block2.prototype.moveDown = function(deltaTime) {
    this.movePoint.position.y -= deltaTime * BLOCK_VELOCITY * this.velocity;
}

Block2.prototype.moveLeft = function() {
    this.movePoint.position.x -= this.length;
}

Block2.prototype.moveFast = function() {
    this.velocity = 5;
}

Block2.prototype.moveRight = function() {
    this.movePoint.position.x += this.length;
}

Block2.prototype.removeCube = function(cube) {
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

Block2.prototype.rotate = function(space) {
    //height will be the next width
    if(this.height <= space) {
        this.pivot.rotation.z += Math.PI / 2;
        this.updateBox();
    }
}

Block2.prototype.rotateBack = function() {
    this.pivot.rotation.z -= Math.PI / 2;
    this.updateBox();
}

Block2.prototype.remove = function() {
    while(this.cubes.length) {
        var c = this.cubes.pop();
    }
    this.movePoint.remove();
}