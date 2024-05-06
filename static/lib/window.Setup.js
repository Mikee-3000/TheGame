import * as THREE from 'three'

export default class WindowSetup { 
    constructor(camera, renderer) {
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        this.mouse = new THREE.Vector2()
        window.addEventListener('resize', () => {
            // Update sizes
            this.sizes.width = window.innerWidth
            this.sizes.height = window.innerHeight

            // Update camera
            camera.aspect = this.sizes.width / this.sizes.height
            camera.updateProjectionMatrix()

            // Update renderer
            renderer.setSize(this.sizes.width, this.sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
    }
}