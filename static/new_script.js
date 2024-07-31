import * as THREE from 'three'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from './node_modules/three/examples/jsm/loaders/RGBELoader.js'
const canvas = document.querySelector('canvas.webgl')
import { RectAreaLightUniformsLib } from './node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import MetricsDisplay from './scene/MetricsDisplay.js'
import getMouse from './scene/Mouse.js'
import ButtonText from './scene/ButtonText.js'
import PolicySettingsDisplay from './scene/PolicySettingsDisplay.js'
import PolicySettingsButton from './scene/PolicySettingsButton.js'
import PolicySettingsButtonPlinth from './scene/PolicySettingsButtonPlinth.js'
import ChartDisplay from './scene/ChartDisplay.js'
import GameState from './lib/GameState.js'
import GameDateDisplay from './scene/GameDateDisplay.js'
import Floor from './scene/Floor.js'
import FillerPanel  from './scene/FillerPanel.js'
import PolicyConsole from './scene/PolicyConsole.js'
import { RectAreaLightHelper } from './node_modules/three/examples/jsm/helpers/RectAreaLightHelper.js'

// utilities
class Points {
    constructor(x, y, z=null) {
        this.x = x
        this.y = y
        this.z = z
    }
}

// Game Data
const gameState = new GameState()

// renderer
window.sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.sizes.width, window.sizes.height)

// scene
const scene = new THREE.Scene()
const sceneGroup = new THREE.Group()
scene.add(sceneGroup)

// Create a rectangular area light
RectAreaLightUniformsLib.init()
const rectLight = new THREE.RectAreaLight('white', 1, 1400.2, 160.5);
const ceilingLight = new THREE.RectAreaLight(0x888888, 100, 1000, 1000);
ceilingLight.position.set(0, 4, 4)
ceilingLight.lookAt(0, 0, 0)
sceneGroup.add(ceilingLight)
// const helper = new RectAreaLightHelper(ceilingLight);
// sceneGroup.add(helper);

// Load the environment map
// Create an RGBE loader
const rgbeLoader = new RGBELoader();
let envMap = null
// load the map from the hdr image
// rgbeLoader.load('/static/textures/HDR_blue_nebulae-1.hdr', (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping
//     envMap = texture
//     scene.background = envMap
//     scene.background.rotation = 45
// })

// objects
const loadingManager = new THREE.LoadingManager();


// floor
const floor = new Floor(envMap)
sceneGroup.add(floor)

// metrics displays
const metricsDisplayGroup = new THREE.Group()
const aggregateDemandPanel = new MetricsDisplay({color: 'green', position: new Points(6.6, 0.5, -1.55), topText: 'Aggregate Demand'}).addTo(metricsDisplayGroup)
const populationPanel = new MetricsDisplay({color: 'red', position: new Points(6.6, 1.6, -1.55), topText: 'Population', bottomText: '3'}).addTo(metricsDisplayGroup)
const governmentDebtPanel = new MetricsDisplay({color: 'blue', position: new Points(6.6, 2.7, -1.55), topText: 'Government Debt', bottomText: '3'}).addTo(metricsDisplayGroup)
const moneySupplyPanel = new MetricsDisplay({color: 'yellow', position: new Points(6.6, 3.8, -1.55), topText: 'Money Supply', bottomText: '3'}).addTo(metricsDisplayGroup)
const unemploymentRatePanel = new MetricsDisplay({color: 'gold', position: new Points(6.6, 4.9, -1.55), topText: 'Unemployment Rate', bottomText: '3'}).addTo(metricsDisplayGroup)
const inflationPanel = new MetricsDisplay({color: 'magenta', position: new Points(-6.6, 4.9, -1.55), topText: 'Inflation', bottomText: '3'}).addTo(metricsDisplayGroup)
const governmentIncomePanel = new MetricsDisplay({color: 'cyan', position: new Points(-6.6, 3.8, -1.55), topText: 'Government Income', bottomText: '3'}).addTo(metricsDisplayGroup)
const netExportPanel = new MetricsDisplay({color: 'white', position: new Points(-6.6, 2.7, -1.55), topText: 'Net Export', bottomText: '3'}).addTo(metricsDisplayGroup)
const investmentPanel = new MetricsDisplay({color: 'purple', position: new Points(-6.6, 1.6, -1.55), topText: 'Investment', bottomText: '3'}).addTo(metricsDisplayGroup)
const consumptionPanel = new MetricsDisplay({color: 'orange', position: new Points(-6.6, 0.5, -1.55), topText: 'Consumption', bottomText: '3'}).addTo(metricsDisplayGroup)
const datePanel = new GameDateDisplay().addTo(metricsDisplayGroup)

// fillers
// const fillerCentres = [0.05, 1.05, 2.15, 3.25, 4.35]
const fillerCentres = [1.05, 2.15, 3.25, 4.35]
for (const f of fillerCentres) {
    new FillerPanel(new Points(3, 0.1, 0.6), new Points(-6.6, f, -1.5)).addTo(metricsDisplayGroup)
    new FillerPanel(new Points(3, 0.1, 0.6), new Points(6.6, f, -1.5)).addTo(metricsDisplayGroup)
}
new FillerPanel(new Points(0.1, 5.4, 0.6), new Points(-8.15, 2.7, -1.5)).addTo(metricsDisplayGroup)
new FillerPanel(new Points(0.1, 1.0, 0.6), new Points(-1.55, 5.94, -1.5)).addTo(metricsDisplayGroup)
new FillerPanel(new Points(0.1, 5.4, 0.6), new Points(8.15, 2.7, -1.5)).addTo(metricsDisplayGroup)
new FillerPanel(new Points(0.1, 1, 0.6), new Points(1.55, 5.94, -1.5)).addTo(metricsDisplayGroup)
new FillerPanel(new Points(3.2, 0.1, 0.6), new Points(0.0, 6.46, -1.5)).addTo(metricsDisplayGroup)
new FillerPanel(new Points(6.7, 0.1, 0.6), new Points(4.85, 5.45, -1.5)).addTo(metricsDisplayGroup)
new FillerPanel(new Points(6.7, 0.1, 0.6), new Points(-4.85, 5.45, -1.5)).addTo(metricsDisplayGroup)

sceneGroup.add(metricsDisplayGroup)
// policy console
// the dimensions are wanted dimensions, the constructor will scale the dimensions of the model
const metricsDisplayGroupBoxSize = new THREE.Box3().setFromObject(metricsDisplayGroup).getSize(new THREE.Vector3())
const policyConsole = new PolicyConsole({x: metricsDisplayGroupBoxSize.x, y: 1, z: 5}, {x:0, y:0.5, z:2}, sceneGroup)
// the gltfLoader loads the model asynchronously
await policyConsole.load()
// put the set of displays on top of the policy console
metricsDisplayGroup.position.set(0, 0.89, -1.209)
const policySettingsDisplayColor = 'black'
const interestRatePanel = new PolicySettingsDisplay({color: policySettingsDisplayColor, position: new Points(6, 0.9, -1), topText: 'Interest Rate'}).addTo(sceneGroup)
const governmentSpendingPanel = new PolicySettingsDisplay({color: policySettingsDisplayColor, position: new Points(3, 0.9, -1), topText: 'Government Spending'}).addTo(sceneGroup)
const openMarketOperations = new PolicySettingsDisplay({color: policySettingsDisplayColor, position: new Points(0, 0.9, -1), topText: 'Open Market Operations'}).addTo(sceneGroup)
const individualIncomeTaxRate = new PolicySettingsDisplay({color: policySettingsDisplayColor, position: new Points(-3, 0.9, -1), topText: 'Individual Income Tax Rate'}).addTo(sceneGroup)
const corporateIncomeTaxRate = new PolicySettingsDisplay({color: policySettingsDisplayColor, position: new Points(-6, 0.9, -1), topText: 'Corporate Income Tax Rate'}).addTo(sceneGroup)

const policySettingsButton = new PolicySettingsButton().addTo(sceneGroup)
const policySettingsButtonPlinth = new PolicySettingsButtonPlinth()
policySettingsButtonPlinth.addTo(sceneGroup)
const buttonText = new ButtonText(sceneGroup)
// this is going to be used to anchor the setters form
// needs to be __cloned__ , otherwise the original will be changed
const originalButtonPosition = policySettingsButton.position.clone()

// chart display
const fakeDates = [
{date: '2024-07-28', metric: 'Investment', value: 0},
{date: '2024-07-28', metric: 'Investment', value: 2},  
{date: '2024-07-28', metric: 'Investment', value: 31},  
{date: '2024-07-28', metric: 'Investment', value: 13},  
{date: '2024-07-28', metric: 'Investment', value: 33},  
{date: '2024-07-28', metric: 'Investment', value: 8},  
{date: '2024-07-28', metric: 'Investment', value: 0.5},  
{date: '2024-07-28', metric: 'Investment', value: 0},  
{date: '2024-07-28', metric: 'Investment', value: -10},  
{date: '2024-07-28', metric: 'Investment', value: 3},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'},  
// {date: '2024-07-28'}  
]
const chartDisplay = new ChartDisplay(fakeDates, sceneGroup)
// chartDisplay.position.set(0, 0, -1.209)

// camera
const camera = new THREE.PerspectiveCamera(75, window.sizes.width / window.sizes.height, 0.1, 30)
camera.position.z = 7
camera.position.y = 3
sceneGroup.add(camera)

// mouse
const mouse = getMouse()
window.addEventListener('click', (event) => {
    mouse.click(camera)
})

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// prevent the controls from looking at the bottom of the floor
// controls.minPolarAngle = 1.1
// controls.maxPolarAngle = 1.5
// default position of the view
controls.target.set(0, 2, 0)
// prevent the scene from moving infinitely after the user stopped moving it
controls.enableDamping = true
controls.dampingFactor = 1
// the default for Y is unintuitive for me
controls.invertY = true;
renderer.render(scene, camera)

window.addEventListener('resize' , () => {
    // update window.sizes
    window.sizes.width = window.innerWidth
    window.sizes.height = window.innerHeight
    // update camera
    camera.aspect = window.sizes.width / window.sizes.height
    camera.updateProjectionMatrix()
    // update renderer
    renderer.setSize(window.sizes.width, window.sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
let counter = 0

const tick = () => {
    // render
    controls.update();
    if (aggregateDemandPanel) {
        aggregateDemandPanel.updateText({bottomText: counter.toString()})
    }

    // if (camera !== undefined) {
    // mouse.update(camera)
    // }

    // rotate the background to give the illusion of a galaxy moving around the player
    if (scene.background) {
        sceneGroup.rotation.y += Math.PI / 1440
        scene.background.needsUpdate = true
        // stop the scene from rotating around the camera
        camera.lookAt(0, 2, 0)
    }

    // the setters form needs to move with the button
    let settersPosition = originalButtonPosition.clone()
    settersPosition.x 
    settersPosition.y += 2
    settersPosition.project(camera)
    let settersPositionX = settersPosition.x * window.sizes.width / 2 
    settersPositionX -= gameState.setters.offsetWidth / 2
    let settersPositionY = settersPosition.y * window.sizes.width / 2 
    settersPositionY += gameState.setters.offsetHeight / 2
    gameState.setters.style.transform = `translate(${settersPositionX}px, ${-settersPositionY}px)`

    counter += 1
    // call tick again on the next frame
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
