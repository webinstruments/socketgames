function QuadBlock(maxWidth, maxHeight, maxColumns, maxRows) {
    this.maxWidth = maxWidth;
    this.length = maxHeight / maxRows;
    if(this.length * maxColumns > maxWidth) {
        this.length = maxWidth / maxColumns;
    }
    this.cubes = [];
    console.log('blockSize', this.length);
}

QuadBlock.prototype.generate = function(scene) {
    var self = this;
    this.group = new THREE.Object3D();

    var positionGeo = new THREE.BoxGeometry(0.1, 0.1, this.length + this.length * 1 / 100);
    var positionMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1 });
    this.anchor = new THREE.Mesh(positionGeo, positionMat);
    this.anchor.transparent = true;
    scene.add(this.anchor); //anchor FIRST!

    this.cubes.push(new Cube(-this.length, 0, this.length));
    this.cubes.push(new Cube(0, 0, this.length));
    this.cubes.push(new Cube(0, -this.length, this.length));
    this.cubes.push(new Cube(-this.length, -this.length, this.length));

    this.cubes.map(function(c) {
        self.group.add(c.cube);
    });
    scene.add(this.group);

    //this.quadGroup.translateX(this.length / 2);
    this.boundingBox = new THREE.Box3().setFromObject(this.group);
    this.width = this.boundingBox.max.x - this.boundingBox.min.x;
    this.height = this.boundingBox.max.y - this.boundingBox.min.y;
    this.group.position.x += this.width / 4;
    this.group.position.y += this.height / 4;

    this.pivot = new THREE.Object3D();
    this.pivot.add(this.group);
    
    scene.add(this.pivot);
    this.anchor.add(this.pivot);

    return this;
}

QuadBlock.prototype.update = function(deltaTime) {
    //this.pivot.rotation.z += deltaTime;
}

QuadBlock.prototype.moveLeft = function() {
    this.anchor.position.x -= this.length;
}

QuadBlock.prototype.moveRight = function() {
    this.anchor.position.x += this.length;
}

QuadBlock.prototype.rotate = function() {
    //this.pivot.rotation.z += Math.PI / 2;
}