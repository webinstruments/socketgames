function addPerspectiveCamera(fov, min, max, x, y, z, lookAt) {
    gameGlobals.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, min, max);
    gameGlobals.camera.position.set(x, y, z);
    gameGlobals.camera.lookAt(lookAt);
}

function addOrthoCamera(min, max, x, y, z) {
    gameGlobals.orthoCamera = 
        new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, 
                                    window.innerHeight / 2, window.innerHeight / -2, min, max);
    gameGlobals.orthoCamera.position.set(x, y, z);
}

function initRenderer(color) {
    if(color) {
        gameGlobals.renderer = new THREE.WebGLRenderer();
        gameGlobals.renderer.setClearColor(color, 1.0);
    } else {
        gameGlobals.renderer = new THREE.WebGLRenderer({ alpha: true });
        gameGlobals.renderer.setClearAlpha(0);
    }
    gameGlobals.renderer.setSize(window.innerWidth, window.innerHeight);
    gameGlobals.renderer.autoClear = false;
    return document.body.appendChild(gameGlobals.renderer.domElement);
}

function addGrid(scene, fieldHeight, fieldWidth, tileSize) {
    var debugGroup = new THREE.Object3D();
    for(var x = 0; x < GAME_COLUMNS + 1; ++x) {
        for(var y = 0; y < GAME_ROWS + 1; ++y) {
            var lineMat = new THREE.LineBasicMaterial({ color: 0xffaa00, linewidth: 1, transparent: true, opacity: 0.1 });
            var lineGeo = new THREE.Geometry();
            var lineMatHorizontal = lineMat.clone();
            var lineGeoHorizontal = lineGeo.clone();
            lineGeo.vertices.push(new THREE.Vector3(x * tileSize, fieldHeight, 0.1));
            lineGeo.vertices.push(new THREE.Vector3(x * tileSize, 0, 0.1));
            lineGeoHorizontal.vertices.push(new THREE.Vector3(0, y * tileSize, 0.1));
            lineGeoHorizontal.vertices.push(new THREE.Vector3(fieldWidth, y * tileSize, 0.1));
            var line = new THREE.Line(lineGeo, lineMat);
            var lineHorizontal = new THREE.Line(lineGeoHorizontal, lineMatHorizontal);
            /*line.computeLineDistances();
            lineHorizontal.computeLineDistances();*/

            //var c = new Cube(x * gameGlobals.blockController.tileSize, y * gameGlobals.blockController.tileSize, 0.1, 0xaaaaaa, 0x000000);
            debugGroup.add(line);
            debugGroup.add(lineHorizontal);
        }
    }
    debugGroup.name = 'debug';
    scene.add(debugGroup);
}

function supportsBackground() { //mobile firefox doen't work with animated background
    return isAndroid() && isFirefox();
}