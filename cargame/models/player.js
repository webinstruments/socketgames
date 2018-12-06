function Player(relativeSize, streetWidth, velocityX, velocityZ, gltfModel, scene) {
    this.relativeSize = relativeSize;
    this.streetWidth = streetWidth;
    this.velocityX = velocityX;
    this.velocityZ = velocityZ;
    this.gltfModel = gltfModel;
    this.globalScene = scene;
    this.create();
}

Player.prototype.updateSize = function() {
    var objectWidth = this.boundingBox.max.x - this.boundingBox.min.x;
    var widthNeeded = this.streetWidth * this.relativeSize;
    var scaleFactor = widthNeeded / objectWidth;
    this.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
    this.boundingBox = this.boundingBox.setFromObject(this.scene);

    this.width = this.boundingBox.max.x - this.boundingBox.min.x;
    this.height = this.boundingBox.max.y - this.boundingBox.min.y;
    this.depth = this.boundingBox.max.z - this.boundingBox.min.z;

    //this.scene.position.y += this.height;
    var cubeGeometry = new THREE.BoxGeometry(
        this.width, this.height, this.depth
    );

    var geo = new THREE.WireframeGeometry(cubeGeometry);
    var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );

    var cube = new THREE.LineSegments(geo, mat);
    cube.name = 'cube';
    cube.position.y += this.height / 2;
    this.globalScene.add(cube);
}

Player.prototype.create = function() {
    var loader = new THREE.GLTFLoader();
    this.boundingBox = null;
    this.scene = null;
    var self = this;
    loader.load(this.gltfModel, function (gltf) {
        self.scene = gltf.scene;
        self.boundingBox = new THREE.Box3().setFromObject(gltf.scene);
        console.log(self.boundingBox);
        self.updateSize();
        console.log(self.boundingBox);
        self.globalScene.add(self.scene);
    }, function(state) {
        console.log(state);
    }, function(error) {
        console.log(error);
    });
 
    return this.scene;
}

Player.prototype.moveLeft = function() {
    this.scene.position.x -= this.velocityX;
    this.scene.rotation.y = Math.cos(Math.PI / 4);
}

Player.prototype.moveRight = function() {
    this.scene.position.x += this.velocityX;
    this.scene.rotation.y = -Math.cos(Math.PI / 4);
}

Player.prototype.update = function() {

}