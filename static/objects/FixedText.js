import * as THREE from 'three'
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js'
import { getBoxSize } from '../lib/helperFuncs.js'


export default class FixedText {
    constructor(position, text, font) {
        this.textGeometry = new TextGeometry(text, {
                    font: font,
                    size: 0.5,
                    depth: 0.2,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
        })
        this.textMaterial = new THREE.MeshBasicMaterial({ color: 'darkblue' })
        this.textObject = new THREE.Mesh(this.textGeometry, this.textMaterial)
        this.textObject.position.set(position.x-(getBoxSize(this.textObject).x/2), position.y, position.z)
    }
}
