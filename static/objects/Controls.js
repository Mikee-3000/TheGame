import { OrbitControls } from '../lib/base.js'

class Controls extends OrbitControls {
    constructor(camera, canvas) {
        super(camera, canvas)
        this.controls = new OrbitControls(camera, canvas)
        this.controls.target.set(0, 1, 0)
        this.controls.enableDamping = true
    }
}

export {Controls}