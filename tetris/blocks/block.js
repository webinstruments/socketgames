function Block(maxWidth, maxHeight, maxColumns, maxRows) {
    this.maxWidth = maxWidth;
    this.length = maxHeight / maxRows;
    if(this.length * maxColumns > maxWidth) {
        this.length = maxWidth / maxColumns;
    }
    console.log('blockSize', this.length);
}

Block.prototype.generate = function(scene) {
    this.group = new THREE.Object3D();
    
    var cubeGeo = new THREE.BoxGeometry(this.length, this.length, this.length);
    var cubeMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    //cubeGeo.translate(this.length / 2, this.length / 2, 0);

    var wireFrameGeo = new THREE.EdgesGeometry(cubeGeo);
    var wireFrameMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 4 });
    var wireframe = new THREE.LineSegments(wireFrameGeo, wireFrameMat);
    wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd

    var positionGeo = new THREE.BoxGeometry(0.1, 0.1, this.length + this.length * 1 / 100);
    var positionMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 1 });
    this.anchor = new THREE.Mesh(positionGeo, positionMat);
    this.anchor.transparent = true;
    scene.add(this.anchor); //anchor FIRST!

    this.cube1 = new THREE.Mesh(cubeGeo, cubeMat);
    this.cube1.position.set(-this.length, 0, -this.length / 2);
    this.cube1.add(wireframe);
    this.cube2 = new THREE.Mesh(cubeGeo, cubeMat);
    this.cube2.position.set(0, 0, -this.length / 2);
    this.cube2.add(wireframe.clone());
    this.cube2.mat
    this.cube3 = new THREE.Mesh(cubeGeo, cubeMat);
    this.cube3.position.set(0, -this.length, -this.length / 2);
    this.cube3.add(wireframe.clone());
    this.cube4 = new THREE.Mesh(cubeGeo, cubeMat);
    this.cube4.position.set(-this.length, -this.length, -this.length / 2);
    this.cube4.add(wireframe.clone());

    this.group.add(this.cube1);
    this.group.add(this.cube2);
    this.group.add(this.cube3);
    this.group.add(this.cube4);
    scene.add(this.group);

    //this.quadGroup.translateX(this.length / 2);
    this.boundingBox = new THREE.Box3().setFromObject(this.group);
    this.width = this.boundingBox.max.x - this.boundingBox.min.x;
    this.height = this.boundingBox.max.y - this.boundingBox.min.y;
    this.group.position.x += this.width - this.width / 4;
    this.group.position.y += 3 * this.height / 4;

    this.pivot = new THREE.Object3D();
    this.pivot.add(this.group);
    
    scene.add(this.pivot);
    this.anchor.add(this.pivot);

    return this;
}

Block.prototype.update = function(deltaTime) {
    this.pivot.rotation.z += deltaTime;
}

Block.prototype.moveLeft = function() {
    this.anchor.position.x -= this.length;
}

Block.prototype.moveRight = function() {
    this.anchor.position.x += this.length;
}