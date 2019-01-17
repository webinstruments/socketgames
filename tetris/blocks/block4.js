/*

    =====
      =
*/

function Block4(length, scene) {
    BlockBase.call(this, length)
    if(scene) {
        this.generate(scene);
    }
}

Block4.prototype = Object.create(BlockBase.prototype);

Block4.prototype.generate = function(scene) {
    var self = this;

    var zIndex = this.length;
    this.movePoint = new MovingPoint(zIndex * 2, 0xff0000);
    this.pivot = new PivotPoint(zIndex, 0xffffff);
    this.movePoint.add(this.pivot.pivot);
    scene.add(this.movePoint.movePoint);

    this.group = new THREE.Object3D();
    var color = 0xa3aff0;
    this.cubes.push(new Cube(0, 0, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(this.length, 0, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(2 * this.length, 0, this.length, color, 0x000000, this));
    this.cubes.push(new Cube(this.length, this.length, this.length, color, 0x000000, this));

    this.cubes.map(function(c) {
        self.group.add(c.cube);
    });
    this.pivot.add(this.group);

    this.updateBox();
    
    this.alignGroup();
  
    return this;
}

Block4.prototype.invert = function() {
    //empty
}