import * as THREE from 'three'

export default class FillerPanel {
    constructor(dimensions, position) {
        this.box = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z)
        this.boxMaterial = new THREE.MeshStandardMaterial({
            color: 'black',
            roughness: 0.5,
            metalness: 0.5,
        })
        this.mesh = new THREE.Mesh(this.box, this.boxMaterial)
        this.mesh.position.set(position.x, position.y, position.z)
    }
    addTo(scene) {
        scene.add(this.mesh)
    }
    
}