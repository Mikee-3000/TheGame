import * as THREE from 'three'
import {gui, canvas, scene, raycaster} from './lib/base.js'
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
let mouse = new Mouse(windowSetup)

const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    raycaster.setFromCamera(mouse.cursor, camera)

    if (consoleObject.consoleModel) {
        consoleObject.size = consoleObject.getSize()
        consoleObject.setPosition(null, consoleObject.size.y / 2, null)
        mouse.currentIntersect = raycaster.intersectObjects([consoleObject.button1])
        if (mouse.currentIntersect.length & !consoleObject.button1.hovered) {
            consoleObject.button1.hovered = true
            consoleObject.hoverLight.material.color.set(0xff0000)
        } else if (!mouse.currentIntersect.length & consoleObject.button1.hovered) {
            consoleObject.button1.hovered = false
            consoleObject.hoverLight.material.color.set(0x0000ff)
        }
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()