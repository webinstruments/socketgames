function Street(texture, width, height) {
    this.texture = texture;
    this.width = width;
    this.height = height;
}

Street.prototype.create = function() {
    var geometry = new THREE.PlaneGeometry(this.width, this.height, 20, 20);
    var texture = new THREE.TextureLoader().load(this.texture);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(this.width / 10, this.height / 10);
    var material = new THREE.MeshBasicMaterial( { map: texture } );
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotateX(-Math.PI / 2);
    return this.mesh;
}