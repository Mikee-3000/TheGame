import * as THREE from 'three'

export default class Floor extends THREE.Mesh {
    constructor() {
        super(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshStandardMaterial({
                color: '#0000ff',
                metalness: 0.9,
                roughness: 0.2,
                transparent: true,
                opacity: 0.7,
            })
        )
        this.receiveShadow = true
        this.rotation.x = - Math.PI * 0.5
        window.scene.add(this)
    }
}