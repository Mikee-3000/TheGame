import * as THREE from 'three'
import {gltfLoader} from '../lib/loader.js'


export default class Console {
    constructor() {
        this.consoleModel = null
        this.loadModel()
    }
    loadModel() {
        gltfLoader.load(
            './static/objects/console.glb',
            (gltf) => {
                this.consoleModel = gltf.scene
                this.consoleModel.castShadow = true
                window.scene.add(this.consoleModel)
            }
        )
    }
    setPosition(x, y, z) {
        this.consoleModel.position.set(x, y, z)
    }
    setRotation(x, y, z) {
        this.consoleModel.rotation.set(x, y, z)
    }
    getSize() {
        let boundingBox = new THREE.Box3().setFromObject(this.consoleModel)
        return boundingBox.getSize(new THREE.Vector3())
    }
}
