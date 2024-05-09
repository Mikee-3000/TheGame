import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import ObjectRegister from '../lib/ObjectRegister.js'

let instance = null;
export default class Setters {
    constructor() {
        if (instance) return instance
        instance = this
        this.group = new THREE.Group()
        this.textInputs = []
        this.cancelButton = null
        this.sendButton = null
        this.objectRegister = new ObjectRegister()
    }
    show() {
        // This makes CSS objects visible and blocks orbit controls
        document.body.appendChild(window.cssRenderer.domElement)
        // set the button on
        this.objectRegister.consoleObject.button1.on()
    }

    hide() {
        // This makes CSS objects invisible and allows orbit controls
        document.body.removeChild(window.cssRenderer.domElement)
        // set the button off
        this.objectRegister.consoleObject.button1.off()
    }

    toggle(on) {
        switch (on) {
            case true:
                this.show()
                break
            case false:
                this.hide()
                break
        }
    }

    addTextInput() {
        const div = document.getElementById('setters')
        const divLabel = new CSS2DObject(div)

        window.scene.add(divLabel)
        divLabel.position.set(0, 0, 1)
        divLabel.scale.set(0.1, 0.1, 0.1)
    }
}