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