import * as THREE from 'three'
import {gltfLoader} from '../lib/loader.js'
import { ConsoleLight, ConsoleButton } from './smallObjects.js'


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
                this.clickLight = new ConsoleLight(2.9, 5.9, -2.8)
                this.hoverLight = new ConsoleLight(3.2, 5.9, -2.8)
                this.button1 = new ConsoleButton(2.9, 4.9, -1.8)
                this.button1.clickCallback = () => {
                    this.clickLight.material.color.set(0x00ff00)
                }
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
