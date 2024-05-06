import * as THREE from 'three'

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
        window.scene.add(this)
    }
    setPos(x, y, z) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
    }
}

export {ConsoleLight, ConsoleButton}