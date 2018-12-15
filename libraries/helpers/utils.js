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

function getIndexOfHeighestValue(arr) {
    var maxIndex = 0;
    var maxValue = arr[0];
    for(var i = 1; i < arr.length; ++i) {
        if(arr[i] > maxValue) {
            maxIndex = i;
            maxValue = arr[i];
        }
    }

    return maxIndex;
}

function getMaxOfArray(arr, mapCB) {
    return Math.max.apply(Math, arr.map(function(obj) {
        return mapCB(obj)
    }));
}

function getMinOfArray(arr, mapCB) {
    return Math.min.apply(Math, arr.map(function(obj) {
        return mapCB(obj)
    }));
}

function findFromArray(arr, findCB) {
    for(var i = 0; i < arr.length; ++i) {
        if(findCB(arr[i])) {
            return arr[i];
        }
    }
    return null;
}

//from 0 to max
function getRandom(max) {
    return Math.floor(Math.random() * (max + 1));
}