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

        this.addEventListener('mouseenter', function(event) {
            this.material.color.set('#0000ff')
            this.hovered = true
            if (this.mouseenterCallback != null) {
                this.mouseenterCallback()
            }
        })

        this.addEventListener('mouseleave', function(event) {
            this.material.color.set('#ff0000')
            this.hovered = false
            if (this.mouseleaveCallback != null) {
                this.mouseleaveCallback()
            }
        })

        this.addEventListener('mousedown', function(event) {
            this.material.color.set('#0000ff')
            this.clicked = true
            if (this.mousedownCallback != null) {
                this.mousedownCallback()
            }
        })
        this.addEventListener('mouseup', function(event) {
            this.material.color.set('#ff0000')
            this.clicked = false
            if (this.mouseupCallback != null) {
                this.mouseupCallback()
            }
        })

        this.hovered = false
        this.clicked = false
        this.mouseenterCallback = null
        this.mouseleaveCallback = null
        this.mouseupCallback = null
        this.mousedownCallback = null
        this.setPos(x, y, z)

        window.mouse.registerObject(this)

        window.scene.add(this)
    }
    setPos(x, y, z) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
    }
}

export {ConsoleLight, ConsoleButton}