import * as THREE from 'three'


export default class Floor extends THREE.Mesh {
    constructor(envMap) {
        const floor = new THREE.PlaneGeometry(10000, 10000)
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x1b0825,
            envMap:envMap,
            envMapIntensity: 1,
            roughness: 0.5,
            metalness: 0.3,
            transparent: true,
            opacity: 0.7
        })
        super(floor, floorMaterial)
        this.rotation.x = -Math.PI / 2
        this.position.y = -0.1
    }
}
