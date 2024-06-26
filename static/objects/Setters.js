import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import ObjectRegister from '../lib/ObjectRegister.js'
import GameData from '../lib/GameData.js'
import { setPolicy } from '../lib/messages.js'
import Displays from './MetricsDisplays/Displays.js'


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
        this.gameData = new GameData()
    }
    show() {
        // This makes CSS objects visible and blocks orbit controls
        document.body.appendChild(window.cssRenderer.domElement)
        // set the button on
        this.setValues('gameData', 'input')
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
        let textInputs = div.querySelectorAll('input[type="text"]');
        textInputs.forEach((input) => {
            var camelCase = input.id.split('-').map((word, index) => {
                if (index === 0) {
                    return word
                }
                return word.charAt(0).toUpperCase() + word.slice(1)
            }).join('')
            this.textInputs[camelCase] = input
        })
        const divLabel = new CSS2DObject(div)

        window.scene.add(divLabel)
        divLabel.position.set(0, 0, 1)
        divLabel.scale.set(0.1, 0.1, 0.1)
    }

    setValues(source, destination) {
        if (source === 'gameData' && destination === 'input') {
            for (const [camelCase, input] of Object.entries(this.textInputs)) {
                document.getElementById(input.id).value = this.gameData[camelCase]
            }
        } else if (source === 'input' && destination === 'gameData') {
            for (const [camelCase, input] of Object.entries(this.textInputs)) {
                this.gameData[camelCase] = document.getElementById(input.id).value
            }
        } else if (source === 'ai' && destination === 'gameData') {
            for (const [camelCase, value] of Object.entries(this.aiResponse)) {
                this.gameData[camelCase] = value
            }
        }
            // TODO: Error handling
    }

    async sendSetters() {
        await this.setValues('input', 'gameData')
        this.hide()
        console.log(this.gameData)
        this.aiResponse = await setPolicy(this.gameData)
        this.setValues('ai', 'gameData')
        let displays = new Displays()
        displays.updateDisplays()
        console.log('response received')
        console.log(this)
    }
}