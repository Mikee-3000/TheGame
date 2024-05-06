import * as THREE from 'three'
import {gui, canvas, scene, raycaster} from './lib/base.js'
import Console from './objects/Console.js'
import {ConsoleLight, ConsoleButton} from './objects/smallObjects.js'
import Floor from './objects/Floor.js'
import {AmbientLight} from './objects/lights.js'
import {Camera} from './objects/Camera.js'
import {Controls} from './objects/Controls.js'
import WindowSetup from './lib/window.Setup.js'
import Renderer from './lib/renderer.js'

window.scene = scene

// Objects
let console = new Console()
let hoverLight = new ConsoleLight()
let clickLight = new ConsoleLight()
let button1 = new ConsoleButton()
let floor = new Floor()
let ambientLight = new AmbientLight()
let camera = new Camera()
let controls = new Controls(camera, canvas)
let renderer = new Renderer(canvas)
let windowSetup = new WindowSetup(camera, renderer)

// Mouse cursor

let pointedObjects = []
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (event) => 
{
    // the values need to be from -1 to 1 left to right 
    mouse.x = event.clientX / windowSetup.sizes.width * 2 - 1
    // the values need to be from -1 to 1 bottom to top
    mouse.y = - (event.clientY / windowSetup.sizes.height) * 2 + 1
})
window.addEventListener('click', (event) => {
    if (pointedObjects.includes(button1)) {
        button1.clicked = !button1.clicked
    }
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    raycaster.setFromCamera(mouse, camera)
    hoverLight.position.y = 0

    if (console.consoleModel)
    {
        console.size = console.getSize()
        console.setPosition(null, console.size.y / 2, null)
        clickLight.setPos(2.9, console.size.y / 2 + 1, -2.8)
        hoverLight.setPos(3.2, console.size.y / 2 + 1, -2.8)
        button1.setPos(2.9, console.size.y / 2, -2.8)
        const objectsToTest = [button1]
        const intersects = raycaster.intersectObjects(objectsToTest)
        // check if consoleModel is in the intersects array
        for (const intersect of intersects) {
            if (!pointedObjects.includes(intersect.object)) {
                pointedObjects.push(intersect.object)   
            }
        }
        if (pointedObjects.includes(button1)){
            // button1Pressed = !button1Pressed
            if (button1.clicked) {
                clickLight.material.color.set('#ff0000')
            } else {
                clickLight.material.color.set('#0000ff')        
            }
            if (!button1.hovered) {
                button1.hovered = true
                hoverLight.material.color.set('blue')
            }
        } else {
            button1.hovered = false
            hoverLight.material.color.set('red')
            pointedObjects.splice(pointedObjects.indexOf(button1), 1)
        }
        // console.log(intersects)
    }




    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()