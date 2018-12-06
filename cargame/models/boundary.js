function Boundary(gameWidth, gameHeight, streetPercent) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.streetPercent = streetPercent;
}

Boundary.prototype.create = function() {
    var geometry = new THREE.BoxGeometry(this.gameWidth * 0.02, this.gameHeight * 0.04, 100);
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.leftBoundary = new THREE.Mesh(geometry, material);
    this.rightBoundary = new THREE.Mesh(geometry, material);
    var width = this.gameWidth * this.streetPercent;
    this.leftBoundary.position.x = -width / 2;
    this.rightBoundary.position.x = width / 2;

    return [ this.leftBoundary, this.rightBoundary ];
}

Boundary.prototype.updatePosition = function(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    var width = gameWidth * this.streetPercent;

    this.leftBoundary.position.x = -width / 2;
    return this.leftBoundary;
}