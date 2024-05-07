import * as THREE from 'three'
import Mouse from '../lib/Mouse.js'

class ConsoleLight extends THREE.Mesh {
    constructor(x, y, z) {
        super(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: '#0000ff' })
        )
        this.setPos(x, y, z)
        window.scene.add(this)
    }
    setPos(x, y, z) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
    }
}

class ConsoleButton extends THREE.Mesh {
    constructor(x, y, z) {
        super(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshStandardMaterial({ color: '#ff0000' })
        )
        this.addEventListener('mousemove', function(event) {
            // this.material.color.set('#ff0000')
            if (this.hovered != null && !this.hovered) {
                this.hovered = true
                this.material.color.set('#0000ff')
            } else if (this.hovered != null && this.hovered) {
                this.hovered = false
                this.material.color.set('#ff0000')
            }
        })
        this.addEventListener('mousedown', function(event) {
            this.material.color.set('#0000ff')
            this.clicked = true
            if (this.clickCallback != null) {
                this.clickCallback()
            }
        })
        this.addEventListener('mouseup', function(event) {
            this.material.color.set('#ff0000')
            this.clicked = false
        })

        this.hovered = false
        this.clicked = false
        this.clickCallback = null
        this.setPos(x, y, z)

        window.mouse.registerObject(this)

        window.scene.add(this)
    }
    setPos(x, y, z) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
    }

        // if (mouse.currentIntersect.length & !consoleObject.button1.hovered) {
        //     consoleObject.button1.hovered = true
        //     consoleObject.hoverLight.material.color.set(0xff0000)
        // } else if (!mouse.currentIntersect.length & consoleObject.button1.hovered) {
        //     consoleObject.button1.hovered = false
        //     consoleObject.hoverLight.material.color.set(0x0000ff)
        // }
}

export {ConsoleLight, ConsoleButton}