import * as THREE from 'three'

function getBoxSize(obj) {
    let boundingBox = new THREE.Box3().setFromObject(obj)
    return boundingBox.getSize(new THREE.Vector3())
}

export {getBoxSize}