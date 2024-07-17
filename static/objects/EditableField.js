import * as THREE from 'three'
import TextureMapText from './TextureMapText.js'
import { canvas } from '../lib/base.js';

export default class EditableField {
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
        this.mesh.position.set(1, 8, 0)
        window.scene.add(this.mesh)
    }
    update(t) {
        // Update the text on the canvas
        let txt = this.textureMapText.text
        this.textureMapText.setText(txt + t)
    }
}