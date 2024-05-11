import * as THREE from 'three'
import TextureMapText from './TextureMapText.js'
import { canvas } from '../lib/base.js';

export default class DigitalClock {
    constructor() {
        this.textureMapText = new TextureMapText('99999999999',
        {
            canvasWidth: 2048,
            canvasHeight: 1024,
            fontFamily: 'Helvetica',
            color: 'green',
            fontSize: 256
        })
        this.material = new THREE.MeshBasicMaterial({ map: this.textureMapText.texture });
        this.geometry = new THREE.BoxGeometry(1, 0.5, 1)
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(0, 8, 0)
        window.scene.add(this.mesh)
    }
    update() {
        // Update the text on the canvas
        const now = new Date()
        const hours = now.getHours().toString(10).padStart(2, '0')
        const minutes = now.getMinutes().toString(10).padStart(2, '0')
        const seconds = now.getSeconds().toString(10).padStart(2, '0')
        const time = `${hours}:${minutes}:${seconds}`
        this.textureMapText.setText(time)
    }
}