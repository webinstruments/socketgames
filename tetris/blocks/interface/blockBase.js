function BlockBase(length) {
    this.cubes = [];
    this.velocity = length;
    this.length = length;
}

BlockBase.prototype.invert = function() {
    this.pivot.rotation.y = Math.PI;
    this.movePoint.position.z = -this.length;
}

BlockBase.prototype.updateBox = function() {
    this.boundingBox = new THREE.Box3().setFromObject(this.pivot.pivot);
    this.width = this.boundingBox.max.x - this.boundingBox.min.x;
    this.height = this.boundingBox.max.y - this.boundingBox.min.y;

    this.pivot.setPosition(this.width / 2, this.height / 2, 0);
}

BlockBase.prototype.setPosition = function(x, y) {
    this.movePoint.position.x = x;
    this.movePoint.position.y = y;
}

BlockBase.prototype.getPosition = function() {
    return this.movePoint.getPosition();
}

BlockBase.prototype.isEmpty = function() {
    return this.cubes.length == 0 || this.cubes.filter(function(cube) {
        return cube.markedForRemoval();
    }).length == this.cubes.length;
}

BlockBase.prototype.moveDown = function(deltaTime) {
    this.movePoint.position.y -= deltaTime * BLOCK_VELOCITY * this.velocity;
}

BlockBase.prototype.moveLeft = function() {
    this.movePoint.position.x -= this.length;
}

BlockBase.prototype.moveFast = function() {
    this.velocity = 5;
}

BlockBase.prototype.moveRight = function() {
    this.movePoint.position.x += this.length;
}

BlockBase.prototype.removeCube = function(cube) {
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

BlockBase.prototype.rotate = function(space) {
    //height will be the next width
    if(this.height - THETA <= space) {
        this.pivot.rotation.z += Math.PI / 2;
        this.updateBox();
    }
}

BlockBase.prototype.undoRotate = function() {
    this.pivot.rotation.z -= Math.PI / 2;
    this.updateBox();
}

BlockBase.prototype.getRotation = function() {
    return this.pivot.rotation.z;
}

BlockBase.prototype.remove = function() {
    while(this.cubes.length) {
        var c = this.cubes.pop();
    }
    this.movePoint.remove();
}

