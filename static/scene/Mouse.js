import * as THREE from 'three'

class Mouse {
    constructor() {
        // mouse events
        this.position = new THREE.Vector2()
        window.addEventListener('mousemove', (event) =>  {
            // the values need to be from -1 to 1 left to right 
            this.position.x = event.clientX / window.sizes.width * 2 - 1
            // the values need to be from -1 to 1 bottom to top
            this.position.y = - (event.clientY / window.sizes.height) * 2 + 1
        })
        this.raycaster = new THREE.Raycaster()
    }
    clickableObjects = []
    addClickableObject(object) {
        this.clickableObjects.push(object)
    }
    click(camera) {
        console.log('click')
        this.raycaster.setFromCamera(this.position, camera)
        const intersects = this.raycaster.intersectObjects(this.clickableObjects)
        if (intersects.length) {
            const clickedObject = intersects[0].object
            clickedObject.click()
        }
    }
}

let instance = null

export default function getMouse() {
    if (!instance) {
        instance = new Mouse()
    }
    return instance;
}