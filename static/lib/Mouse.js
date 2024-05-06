import * as THREE from 'three'

export default class Mouse {
    constructor(windowSetup) {
        let cursor = new THREE.Vector2()
        this.cursor = cursor
        this.currentIntersect = []
        window.addEventListener('mousemove', (event) => {
            // the values need to be from -1 to 1 left to right 
            cursor.x = event.clientX / windowSetup.sizes.width * 2 - 1
            // the values need to be from -1 to 1 bottom to top
            cursor.y = - (event.clientY / windowSetup.sizes.height) * 2 + 1
        })
        window.addEventListener('mousedown', (event) => {
            if (this.currentIntersect.length > 0) {
                this.currentIntersect[0].object.dispatchEvent({type: 'mousedown'})
            }
        })
        window.addEventListener('mouseup', (event) => {
            if (this.currentIntersect.length > 0) {
                this.currentIntersect[0].object.dispatchEvent({type: 'mouseup'})
            }
        })
    }
}