import * as THREE from 'three'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from './node_modules/three/examples/jsm/loaders/RGBELoader.js'
const canvas = document.querySelector('canvas.webgl')
import { RectAreaLightUniformsLib } from './node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import MetricsDisplay from './scene/MetricsDisplay.js'
import GameDateDisplay from './scene/GameDateDisplay.js'
import Floor from './scene/Floor.js'

// utilities
class Points {
    constructor(x, y, z=null) {
        this.x = x
        this.y = y
        this.z = z
    }
}

// renderer
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)

// scene
const scene = new THREE.Scene()
const sceneGroup = new THREE.Group()
scene.add(sceneGroup)

// Create a rectangular area light
RectAreaLightUniformsLib.init()
const rectLight = new THREE.RectAreaLight('white', 1, 1400.2, 160.5);
const ceilingLight = new THREE.RectAreaLight(0x888888, 10, 1000, 1000);
ceilingLight.position.set(0, 7, 0)
ceilingLight.lookAt(0, 0, 0)
sceneGroup.add(ceilingLight)

// Load the environment map
// Create an RGBE loader
const rgbeLoader = new RGBELoader();
let envMap = null
// load the map from the hdr image
rgbeLoader.load('/static/textures/HDR_blue_nebulae-1.hdr', (texture) => {
    // Pre-filter the HDR image
    texture.rotation = 45
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    envMap = pmremGenerator.fromEquirectangular(texture).texture;
    // Set the environment map of the scene
    scene.environment = envMap;
    scene.background = envMap
    scene.background.rotation = 45
});

// objects
const loadingManager = new THREE.LoadingManager();

class FillerPanel {
    constructor(dimensions, position) {
        this.box = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z)
        this.boxMaterial = new THREE.MeshStandardMaterial({
            color: 'black',
            roughness: 0.5,
            metalness: 0.5,
        })
        this.mesh = new THREE.Mesh(this.box, this.boxMaterial)
        this.mesh.position.set(position.x, position.y, position.z)
        sceneGroup.add(this.mesh)
    }
    
}

// floor
const floor = new Floor(envMap)
sceneGroup.add(floor)

// metrics displays
const aggregateDemandPanel = new MetricsDisplay({color: 'green', position: new Points(6.6, 0.5, -1.55), topText: 'Aggregate Demand'})
sceneGroup.add(aggregateDemandPanel)
const populationPanel = new MetricsDisplay({color: 'red', position: new Points(6.6, 1.6, -1.55), topText: 'Population', bottomText: '3'})
sceneGroup.add(populationPanel)
const governmentDebtPanel = new MetricsDisplay({color: 'blue', position: new Points(6.6, 2.7, -1.55), topText: 'Government Debt', bottomText: '3'})
sceneGroup.add(governmentDebtPanel)
const moneySupplyPanel = new MetricsDisplay({color: 'yellow', position: new Points(6.6, 3.8, -1.55), topText: 'Money Supply', bottomText: '3'})
sceneGroup.add(moneySupplyPanel)
const unemploymentRatePanel = new MetricsDisplay({color: 'gold', position: new Points(6.6, 4.9, -1.55), topText: 'Unemployment Rate', bottomText: '3'})
sceneGroup.add(unemploymentRatePanel)
const inflationPanel = new MetricsDisplay({color: 'magenta', position: new Points(-6.6, 4.9, -1.55), topText: 'Inflation', bottomText: '3'})
sceneGroup.add(inflationPanel)
const governmentIncomePanel = new MetricsDisplay({color: 'cyan', position: new Points(-6.6, 3.8, -1.55), topText: 'Government Income', bottomText: '3'})
sceneGroup.add(governmentIncomePanel)
const netExportPanel = new MetricsDisplay({color: 'white', position: new Points(-6.6, 2.7, -1.55), topText: 'Net Export', bottomText: '3'})
sceneGroup.add(netExportPanel)
const investmentPanel = new MetricsDisplay({color: 'purple', position: new Points(-6.6, 1.6, -1.55), topText: 'Investment', bottomText: '3'})
sceneGroup.add(investmentPanel)
const consumptionPanel = new MetricsDisplay({color: 'orange', position: new Points(-6.6, 0.5, -1.55), topText: 'Consumption', bottomText: '3'})
sceneGroup.add(consumptionPanel)
const datePanel = new GameDateDisplay()
sceneGroup.add(datePanel)

// fillers
const fillerCentres = [1.05, 2.15, 3.25, 4.35]
for (const f of fillerCentres) {
    new FillerPanel(new Points(3, 0.1, 0.6), new Points(-6.6, f, -1.5))
    new FillerPanel(new Points(3, 0.1, 0.6), new Points(6.6, f, -1.5))
}
new FillerPanel(new Points(0.1, 5.4, 0.6), new Points(-5.05, 2.7, -1.5))
new FillerPanel(new Points(0.1, 5.4, 0.6), new Points(-8.16, 2.7, -1.5))
new FillerPanel(new Points(0.1, 1.0, 0.6), new Points(-1.56, 6.01, -1.5))
new FillerPanel(new Points(0.1, 5.4, 0.6), new Points(5.05, 2.7, -1.5))
new FillerPanel(new Points(0.1, 5.4, 0.6), new Points(8.16, 2.7, -1.5))
new FillerPanel(new Points(0.1, 1.0, 0.6), new Points(1.56, 6.01, -1.5))
new FillerPanel(new Points(3.22, 0.1, 0.6), new Points(0.0, 6.52, -1.5))
new FillerPanel(new Points(16.4, 0.1, 0.6), new Points(0.0, 5.45, -1.5))


// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 20)
camera.position.z = 7
camera.position.y = 3
sceneGroup.add(camera)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// prevent the controls from looking at the bottom of the floor
controls.minPolarAngle = 1.1;
controls.maxPolarAngle = 1.5;
// default position of the view
controls.target.set(0, 2, 0)
renderer.render(scene, camera)

window.addEventListener('resize' , () => {
    // update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
let counter = 0
const tick = () => {
    // render
    controls.update();
    aggregateDemandPanel.updateText({bottomText: counter.toString()})

    // rotate the background to give the illusion of a galaxy moving around the player
    if (scene.background) {
        sceneGroup.rotation.y += Math.PI / 1440
        scene.background.needsUpdate = true
    }
    counter += 1
    // call tick again on the next frame
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
