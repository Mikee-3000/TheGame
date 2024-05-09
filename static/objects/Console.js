import * as THREE from 'three'
import {gltfLoader} from '../lib/loader.js'
import ObjectRegister from '../lib/ObjectRegister.js'
import { ConsoleLight, ConsoleButton } from './smallObjects.js'

// This code puts together the main console model


class SettersButton extends ConsoleButton {
    constructor(width, height, depth, parent) {
        super(width, height, depth);
        // Add custom functionality or override existing methods here
        this.state = false
        this.mousedownCallback = () => {
            parent.clickLight.material.color.set(0x00ff00)
            this.toggle()
        }
        this.mouseupCallback = () => {
            parent.clickLight.material.color.set(0x0000ff)
        }
        this.mouseenterCallback = () => {
            ;
        }
        this.mouseleaveCallback = () => {
            ;
        }
    }
    toggle() {
        // it goes out and back around, but it's not a problem
        window.setters.toggle(!this.state)
    }
    on() {
        this.state = true
        this.material.color.set(0x00ff00)
    }
    off() {
        this.state = false
        this.material.color.set(0xff0000)
    }
}


class Console {
    constructor() {
        this.consoleModel = null 
        this.size = null
        this.button1 = new SettersButton(2.9, 4.9, -1.8, this)
        let objectRegister = new ObjectRegister()
        objectRegister.registerObject(this, 'consoleObject')
        this.clickLight = new ConsoleLight(2.9, 5.9, -2.8)
        this.hoverLight = new ConsoleLight(3.2, 5.9, -2.8)
    }
    setPosition(x, y, z) {
        this.consoleModel.position.set(x, y, z)
    }
    setRotation(x, y, z) {
        this.consoleModel.rotation.set(x, y, z)
    }
    getBoxSize() {
        let boundingBox = new THREE.Box3().setFromObject(this.consoleModel)
        return boundingBox.getSize(new THREE.Vector3())
    }
    setSize() {
        this.size = this.getBoxSize()
    }
    getSize() {
        return this.size
    }
}

export default async function createConsoleInstance() {
    const instance = new Console()
    let gltf = await gltfLoader.loadAsync('./static/objects/console.glb')
    instance.consoleModel = gltf.scene
    instance.setSize()
    instance.setPosition(null, instance.getSize().y / 2, null)
    window.scene.add(instance.consoleModel)
    return instance
}