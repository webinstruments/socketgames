function getWidthFromDistance(distance, camera, aspect) {
    var height = getHeightFromDistance(distance, camera);
    if(aspect) {
        return height * aspect;
    } else {
        return height * camera.aspect;
    }
}

function getHeightFromDistance(distance, camera) {
    var vFOV = THREE.Math.degToRad(camera.fov);
    return 2 * Math.tan(vFOV / 2) * distance;
}