import * as THREE from 'three'
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js'
import { getBoxSize } from '../lib/helperFuncs.js'

export default class FixedText {
    constructor(position, text) {
        const fontLoader = new FontLoader()
        fontLoader.load(
            './static/objects/fonts/gentilis/gentilis_bold.typeface.json',
            (font) => {
                const textGeometry = new TextGeometry(text, {
                    font: font,
                    size: 0.5,
                    depth: 0.2,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                })
                const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
                const textObject = new THREE.Mesh(textGeometry, textMaterial)
                this.textObject = textObject
                textObject.position.set(position.x-(getBoxSize(textObject).x/2), position.y, position.z)
                window.scene.add(textObject)
            }
        )
    }
}
