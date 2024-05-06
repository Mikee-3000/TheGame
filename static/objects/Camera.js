import * as THREE from 'three'

class Camera extends THREE.PerspectiveCamera {
    constructor() {
        super(75, window.innerWidth / window.innerHeight, 0.1, 100)
        this.position.set(0, 12, 12)
        window.scene.add(this)
    }
}

export {Camera}