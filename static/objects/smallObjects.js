import * as THREE from 'three'

class ConsoleLight extends THREE.Mesh {
    constructor() {
        super(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: '#0000ff' })
        )
        window.scene.add(this)
    }
    setPos(x, y, z) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
    }
}

class ConsoleButton extends THREE.Mesh {
    constructor() {
        super(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshStandardMaterial({ color: '#ff0000' })
        )
        this.hovered = false
        this.clicked = false
        window.scene.add(this)
    }
    setPos(x, y, z) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
    }
}

export {ConsoleLight, ConsoleButton}