import * as THREE from 'three'

class Camera extends THREE.PerspectiveCamera {
    constructor() {
        super(50, window.innerWidth / window.innerHeight, 0.1, 30)
        this.position.set(0, 10, 15)
        window.scene.add(this)
    }
}

export {Camera}