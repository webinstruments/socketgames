/*  
    ---
    | |
    ---
*/
function Block1(length, scene) {
    BlockBase.call(this, length)
    if(scene) {
        this.generate(scene);
    }
}

Block1.prototype = Object.create(BlockBase.prototype);

Block1.prototype.generate = function(scene) {
    var self = this;

    var zIndex = this.length;
    this.movePoint = new MovingPoint(zIndex * 2, 0xff0000);
    this.pivot = new PivotPoint(zIndex, 0xffffff);
    this.movePoint.add(this.pivot.pivot);
    scene.add(this.movePoint.movePoint);

    this.group = new THREE.Object3D();
    var color = 0xffb000;
    this.cubes.push(new Cube(-this.length, 0, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(0, 0, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(-this.length, -this.length, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(0, -this.length, this.length, color, 0x000000, this));

    this.cubes.map(function(c) {
        self.group.add(c.cube);
    });
    this.pivot.add(this.group);

    this.boundingBox = new THREE.Box3().setFromObject(this.group);
    this.width = this.boundingBox.max.x - this.boundingBox.min.x;
    this.height = this.boundingBox.max.y - this.boundingBox.min.y;

    this.pivot.setPosition(this.length, this.length, 0);
    this.group.position.x = this.length / 2;
    this.group.position.y = this.length / 2;

    return this;
}

Block1.prototype.rotate = function() {
    //this.pivot.rotation.z += Math.PI / 2;
}

Block1.prototype.getRotation = function() {
    return 0;
}

Block1.prototype.invert = function() {
    //empty
}