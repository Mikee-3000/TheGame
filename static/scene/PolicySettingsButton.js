import * as THREE from 'three'
import getMouse from './Mouse.js'

export default class PolicySettingsButton extends THREE.Mesh {
    constructor({color, position, radius, height}) {
        const geometry = new THREE.CylinderGeometry(radius, radius, height, 32)
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
