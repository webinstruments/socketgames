function getWidthFromDistance(distance, camera, aspect) {
    var vFOV = THREE.Math.degToRad(camera.fov);
    var height = 2 * Math.tan(vFOV / 2) * distance;
    if(aspect) {
        return height * aspect;
    } else {
        return height * camera.aspect;
    }
}

function getHeightFromDistance(distance, camera) {
    var vFOV = THREE.Math.degToRad(camera.fov);
    return height = 2 * Math.tan(vFOV / 2) * distance;
}