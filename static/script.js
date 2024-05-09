import * as THREE from 'three'
import {gui, canvas, scene} from './lib/base.js'
import Console from './objects/Console.js'
import Floor from './objects/Floor.js'
import {AmbientLight} from './objects/lights.js'
import {Camera} from './objects/Camera.js'
import {Controls} from './objects/Controls.js'
import WindowSetup from './lib/window.Setup.js'
import Renderer from './lib/renderer.js'
import Mouse from './lib/Mouse.js'

window.scene = scene

// Objects
let consoleObject = new Console()
let floor = new Floor()
let ambientLight = new AmbientLight()
let camera = new Camera()
let controls = new Controls(camera, canvas)
let renderer = new Renderer(canvas)
let windowSetup = new WindowSetup(camera, renderer)
// mouse needs to be global so that in can be used by objects to register themselves to receive clicks
window.mouse = new Mouse(windowSetup, camera)

const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // this needs to be done here, because browsers sometimes creates mouse events faster than the framerate

    if (consoleObject.consoleModel) {
        consoleObject.size = consoleObject.getSize()
        consoleObject.setPosition(null, consoleObject.size.y / 2, null)
    }
    window.mouse.castRay(camera)
    // Update controls
    controls.update()

    // Render
    renderer.render(window.scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()