var camera;
var orthoCamera;
var renderer;

function addPerspectiveCamera(fov, min, max, x, y, z, lookAt) {
    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, min, max);
    camera.position.set(x, y, z);
    camera.lookAt(lookAt);
}

function addOrthoCamera(min, max, x, y, z) {
    orthoCamera = 
        new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, 
                                    window.innerHeight / 2, window.innerHeight / -2, min, max);
    orthoCamera.position.set(x, y, z);
}

function initRenderer(color) {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(color, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);
}

function addGrid(scene, fieldHeight, fieldWidth, tileSize) {
    var debugGroup = new THREE.Object3D();
    for(var x = 0; x < GAME_COLUMNS + 1; ++x) {
        for(var y = 0; y < GAME_ROWS + 1; ++y) {
            var lineMat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 });
            var lineGeo = new THREE.Geometry();
            var lineMatHorizontal = lineMat.clone();
            var lineGeoHorizontal = lineGeo.clone();
            lineGeo.vertices.push(new THREE.Vector3(x * tileSize, fieldHeight, 0.1));
            lineGeo.vertices.push(new THREE.Vector3(x * tileSize, 0, 0.1));
            lineGeoHorizontal.vertices.push(new THREE.Vector3(0, y * tileSize, 0.1));
            lineGeoHorizontal.vertices.push(new THREE.Vector3(fieldWidth, y * tileSize, 0.1));
            var line = new THREE.Line(lineGeo, lineMat);
            var lineHorizontal = new THREE.Line(lineGeoHorizontal, lineMatHorizontal);

            //var c = new Cube(x * blockController.tileSize, y * blockController.tileSize, 0.1, 0xaaaaaa, 0x000000);
            debugGroup.add(line);
            debugGroup.add(lineHorizontal);
        }
    }
    debugGroup.name = 'debug';
    scene.add(debugGroup);
}