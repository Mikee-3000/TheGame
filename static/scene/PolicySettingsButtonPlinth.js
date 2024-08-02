import * as THREE from 'three'

export default class PolicySettingsButtonPlinth extends THREE.Mesh {
    constructor() {
        super(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial())
        this.material = new THREE.MeshStandardMaterial({
            color: 'black',
            roughness: 0.5,
            metalness: 0.5
        })
        // this.material = new THREE.MeshBasicMaterial({color: 'black'})
        this.geometry = new THREE.BoxGeometry(2, 0.6, 2.21)
        super.geometry = this.geometry
        super.material = this.material
        this.position.set(0, 0.186, 0.8890)
    }
    addTo(scene) {
        scene.add(this)
    }
}