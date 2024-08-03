import * as THREE from 'three'

export default class StarSphere extends THREE.Mesh {
    constructor() {
        const loader = new THREE.TextureLoader(window.loadingManager)
        const texture = loader.load('/static/textures/HDR_blue_nebulae-1.png')
        const geometry = new THREE.SphereGeometry(20, 32, 32)
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })
        super(geometry, material)
        console.log(this)
    }
    addTo(scene) {
        scene.add(this)
        return this
    }
}