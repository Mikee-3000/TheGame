import * as THREE from 'three'
import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js' 

export default class ButtonText extends THREE.Mesh {
    constructor(scene, loadingManager) {
        // Call the super constructor with dummy arguments
        super(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial())

        // Load the font
        const fontLoader = new FontLoader(window.loadingManager)
        const fontUrl = '/static/textures/fonts/gentilis/gentilis_bold.typeface.json'
        const text='SET POLICY'
        fontLoader.load(fontUrl, (font) => {
            // Add text to the button
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: 0.18,
                depth: 0.01,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0.02,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            })
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })

            // Update the geometry and material of the mesh
            this.geometry = textGeometry
            this.material = textMaterial
            const boundingBox = new THREE.Box3().setFromObject(this)
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            scene.add(this)
            this.position.set(-size.x/2, 0.15, size.z/2 + 1.98)
        })
    }
}
