function getWidthFromDistance(distance, camera) {
    var vFOV = THREE.Math.degToRad(camera.fov);
    var height = 2 * Math.tan(vFOV / 2) * distance;
    return height * camera.aspect;
}