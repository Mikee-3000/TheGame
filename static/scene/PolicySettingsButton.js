import * as THREE from 'three'
import getMouse from './Mouse.js'

export default class PolicySettingsButton extends THREE.Mesh {
    constructor() {
        const color = 'red'
        const position = {x: 0, y: .5, z: 1}
        const radius = '0.5'
        const height = '0.1'
        const geometry = new THREE.CylinderGeometry(radius, radius, height, 512)
        const material = new THREE.MeshBasicMaterial({ color: color })
        super(geometry, material)
        this.name = 'policySettingsButton'
        this.position.set(position.x, position.y, position.z)

        // register for click events
        const mouse = getMouse()
        mouse.addClickableObject(this)

    }
    // on click
    click() {
        this.material.color.set(0x00ff00)
    }
    addTo(scene) {
        scene.add(this)
    }  
}
