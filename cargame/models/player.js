var PLAYER_STATES_LEFT = "LEFT";
var PLAYER_STATES_RIGHT = "RIGHT";
var PLAYER_STATES_FORWARD = "FORWARD";
var PLAYER_MAX_ANGLE = Math.PI / 2;

//velocityX - relativ: Strecke pro Sekunde in %
//velocityY - pixel per second
//velocityCurve Winkel pro Sekunde (rad)
function Player(relativeSize, streetWidth, velocityX, velocityZ, velocityCurve, gltfModel, scene, onLoadCB) {
    this.relativeSize = relativeSize;
    this.streetWidth = streetWidth;
    this.velocityX = velocityX;
    this.velocityZ = velocityZ;
    this.velocityCurve = velocityCurve;
    this.gltfModel = gltfModel;
    this.globalScene = scene;
    this.state = PLAYER_STATES_FORWARD;
    this.onLoadCB = onLoadCB;
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

    if(this.onLoadCB) {
        this.onLoadCB();
    }
    
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
    this.state = PLAYER_STATES_LEFT;
}

Player.prototype.moveRight = function() {
    this.state = PLAYER_STATES_RIGHT;
}

Player.prototype.moveForward = function() {
    this.state = PLAYER_STATES_FORWARD;
}

Player.prototype.update = function(deltaTime) {
    if(this.scene == null) {
        return;
    }
    if(this.state === PLAYER_STATES_LEFT) {
        if(this.scene.rotation.y <= PLAYER_MAX_ANGLE) {
            this.scene.rotation.y += this.velocityCurve * deltaTime;
        }
        this.scene.position.x -= this.streetWidth * this.velocityX * deltaTime;
    } else if (this.state === PLAYER_STATES_RIGHT) {
        if(this.scene.rotation.y >= -PLAYER_MAX_ANGLE) {
            this.scene.rotation.y -= this.velocityCurve * deltaTime;
        }
        this.scene.position.x += this.streetWidth * this.velocityX * deltaTime;
    } else {
        this.scene.rotation.y = 0;
    }

    this.scene.position.z -= this.velocityZ * deltaTime;
}