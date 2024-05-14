import * as THREE from 'three'
import {gui, canvas, scene, cssRenderer} from './lib/base.js'
import createConsoleInstance from './objects/Console.js'
import Floor from './objects/Floor.js'
import {AmbientLight} from './objects/lights.js'
import {Camera} from './objects/Camera.js'
import {Controls} from './objects/Controls.js'
import WindowSetup from './lib/window.Setup.js'
import Renderer from './lib/renderer.js'
import Mouse from './lib/Mouse.js'
import Setters from './objects/Setters.js'
import GameData from './lib/GameData.js'
import FixedText from './objects/FixedText.js'
import DigitalClock from './objects/DigitalClock.js'
import Displays from './objects/MetricsDisplays/Displays.js'
import Calendar from './objects/Calendar.js'

window.scene = scene

// Objects
let gameData = new GameData()
let renderer = new Renderer(canvas)
let camera = new Camera()
let windowSetup = new WindowSetup(camera, renderer)
window.mouse = new Mouse(windowSetup, camera)
let consoleObject = await createConsoleInstance()
let floor = new Floor()
let ambientLight = new AmbientLight()
let controls = new Controls(camera, canvas)
controls.target = new THREE.Vector3(0, 5, 0)
// mouse needs to be global so that in can be used by objects to register themselves to receive clicks
window.cssRenderer = cssRenderer
window.setters = new Setters()
window.setters.addTextInput()
const fixedText = new FixedText(new THREE.Vector3(0, consoleObject.getBoxSize().y, -consoleObject.getBoxSize().z), 'DON\'T PANIC!')
const clock = new THREE.Clock()
let previousTime = 0
const digitalClock = new DigitalClock()
const displays = new Displays()
const calendar = new Calendar()


const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    digitalClock.update()
    digitalClock.mesh.rotation.y = (Math.PI / 4) * elapsedTime

    calendar.dateUpdate()

    // this needs to be done here, because browsers sometimes creates mouse events faster than the framerate
    window.mouse.castRay(camera)
    
    // Update controls
    controls.update()

    // Render
    renderer.render(window.scene, camera)
    cssRenderer.render(window.scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()