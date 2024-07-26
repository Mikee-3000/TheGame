import * as THREE from 'three'
import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js' 

export default class ButtonText extends THREE.Mesh {
    constructor(scene) {
        // Call the super constructor with dummy arguments
        super(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial())

        // Load the font
        const fontLoader = new FontLoader()
        const fontUrl = '/static/textures/fonts/gentilis/gentilis_bold.typeface.json'
        const text = 'Set Policy'
        fontLoader.load(fontUrl, (font) => {
            // Add text to the button
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: 0.2,
                depth: 0.01,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            })
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

            // Update the geometry and material of the mesh
            this.geometry = textGeometry
            this.material = textMaterial

            scene.add(this)
        })
    }
}
