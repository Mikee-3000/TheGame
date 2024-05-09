import * as THREE from 'three'

export default class Mouse {
    constructor(windowSetup, camera) {
        let cursor = new THREE.Vector2()
        this.cursor = cursor
        this.camera = camera
        this.raycaster = new THREE.Raycaster()
        this.clickedObject = null
        this.hoveredObject = null
        this.currentIntersect = []
        this.registeredObjects = []
        
        // Event listeners
        window.addEventListener('mousemove', (event) => {
            cursor.x = event.clientX / windowSetup.sizes.width * 2 - 1
            cursor.y = - (event.clientY / windowSetup.sizes.height) * 2 + 1
            if (this.currentIntersect.length > 0) {
                this.hoveredObject.dispatchEvent({type: 'mousemove'})
            }
        })
        window.addEventListener('mousedown', (event) => {
            if (this.currentIntersect.length > 0) {
                this.clickedObject = this.currentIntersect[0].object
                this.clickedObject.dispatchEvent({type: 'mousedown'})
            }
        })
        window.addEventListener('mouseup', (event) => {
            if (this.clickedObject) {
                this.clickedObject.dispatchEvent({type: 'mouseup'})
                this.clickedObject = null
            }
        })
    }
    registerObject(obj) {
        this.registeredObjects.push(obj)
    }
    castRay(camera) {
        this.raycaster.setFromCamera(this.cursor, camera)
        this.currentIntersect = this.raycaster.intersectObjects(this.registeredObjects, true)
        const previousIntersect = this.hoveredObject
        this.setHoveredObject()
        const newIntersect = this.hoveredObject

        if (previousIntersect != newIntersect) { 
            if (newIntersect !== null) {
                newIntersect.dispatchEvent({type: 'mouseenter'})
            }
            if (previousIntersect !== null) {
                previousIntersect.dispatchEvent({type: 'mouseleave'})
            }
        }
    }   

    setHoveredObject(obj) {
        this.hoveredObject = this.currentIntersect.length > 0 ? this.currentIntersect[0].object : null
    }
}