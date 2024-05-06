import * as THREE from 'three'

class AmbientLight extends THREE.AmbientLight {
    constructor() {
        super(0xffffff, 2.4)
        window.scene.add(this)
    }
}

export {AmbientLight}