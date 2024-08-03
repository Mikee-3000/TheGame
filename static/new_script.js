import * as THREE from 'three'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from './node_modules/three/examples/jsm/loaders/RGBELoader.js'
const canvas = document.querySelector('canvas.webgl')
import { RectAreaLightUniformsLib } from './node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { gsap } from './node_modules/gsap/all.js'
import MetricsDisplays from './scene/MetricsDisplays.js'
import StarSphere from './scene/SkySphere.js'
import URLVault from './lib/URLVault.js'
import DataFetcher from './lib/DataFetcher.js'
import getMouse from './scene/Mouse.js'
import ButtonText from './scene/ButtonText.js'
import PolicySettingsDisplays from './scene/PolicySettingsDisplays.js'
import PolicySettingsButton from './scene/PolicySettingsButton.js'
import PolicySettingsButtonPlinth from './scene/PolicySettingsButtonPlinth.js'
import ChartDisplay from './scene/ChartDisplay.js'
import GameState from './lib/GameState.js'
import Floor from './scene/Floor.js'
import PolicyConsole from './scene/PolicyConsole.js'
import { Points } from './lib/utils.js'

// Game Data
// retrieve the scenario ID from an invisible div
const scenarioId = document.getElementById('data').dataset.scenario
const gameState = new GameState(scenarioId)
const urlVault = new URLVault()

// hide the scene until it's loaded
const loadingOverlay = document.querySelector('.loading-overlay')
const loadingBar = document.querySelector('.loading-bar')

// end of game overlay
const endOverlay = document.querySelector('.end-overlay')
const winResultDiv = document.getElementById('win')
const loseResultDiv = document.getElementById('lose')

// the animation loop
let counter = 0
const clock = new THREE.Clock()
// setting this to -1 will pass the if on start
let daysPast = -1
const tick = () => {
    // render
    controls.update();
    if ( counter % 100 == 0 && metricsDisplays.aggregateDemandPanel) {
        metricsDisplays.aggregateDemandPanel.updateText({bottomText: counter.toString()})
    }

    // the setters form needs to move with the button
    let settersPosition = originalButtonPosition.clone()

    // if the setters are on, don't run time
    if (!gameState.setters.clicked) {
        // rotate the sky, it looks pretty
        starSphere.rotation.y += Math.PI / 14400
        starSphere.rotation.x += Math.PI / 14400
        // update the date
        const dayCheck = Math.floor(clock.getElapsedTime())
        if (daysPast != dayCheck) {
            daysPast = dayCheck
            // update the counter
            counter += 1
            // this is a new day
            if (counter % 5 === 0) {
                // update the date
                gameState.addDayToGameDate()
                // update the date display
                metricsDisplays.datePanel.updateValue(gameState.currentDate)
                metricsDisplays.updateValuesAndColors(gameState.colorDailyMetrics())
                if (counter == 1000) {
                    if (gameState.result == 'win') {
                        loseResultDiv.remove()
                        winResultDiv.style.opacity = 1
                    } else {
                        winResultDiv.remove()
                        loseResultDiv.style.opacity = 1
                    }
                    gsap.to(endOverlay, { 
                        display: 'flex', opacity: 1, duration: 1
                    })
                }
            }
            // let's rotate the metric charts in the middle ab it faster than daily
            if (counter % 3 === 0) {
                // sceneGroup.remove(chartDisplay)
                const chosenMetric = gameState.metricsList[counter % gameState.metricsList.length]
                if (chartDisplay !== null) {
                    chartDisplay.destroy()
                }
                chartDisplay.create(gameState.getLastTenDaysMetrics(chosenMetric))
            }
        }
    } else {
        settersPosition.y += 2
        settersPosition.z = 0
        settersPosition.project(camera)
        let settersPositionX = settersPosition.x * window.sizes.width / 2 
        settersPositionX -= gameState.setters.offsetWidth / 2 
        let settersPositionY = settersPosition.y * window.sizes.width / 2 
        settersPositionY += gameState.setters.offsetHeight / 2
        gameState.setters.style.transform = `translate(${settersPositionX}px, ${-settersPositionY}px)`
    }
    // call tick again on the next frame
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

// loading overlay with progress bar
window.loadingManager = new THREE.LoadingManager(
    ( ) => {
        gsap.delayedCall(0.5, () => {
            gsap.to(
                loadingOverlay,
                { duration: 3, opacity: 0, delay: 1
                    , onComplete: () => {
                        loadingOverlay.classList.add('ended')
                    }
                }
            )
            loadingBar.classList.add('ended')
            loadingBar.style.transform = ''
            metricsDisplays.datePanel.updateValue(gameState.currentDate)
            metricsDisplays.updateValues(gameState.getDailyMetricsAsString())
            chartDisplay.create(gameState.getLastTenDaysMetrics(gameState.metricsList[0]))
            policySettingsDisplays.updateValues(gameState.policySettings.getValuesAsStrings())
            tick()
        })
    },
    ( url, itemsLoaded, itemsTotal ) => {
        loadingBar.style.transform = `scaleX(${itemsLoaded / itemsTotal})`
    }
)

// data loader for LLM responses
const dataFetcher = new DataFetcher(window.loadingManager)
const initData = {
  "start_gt_timestamp": gameState.startTimestamp,
  "scenario_id": gameState.scenarioId
}
dataFetcher.load(urlVault.new_game_url, initData)

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
gameState.scene = scene
scene.add(sceneGroup)

// camera
const camera = new THREE.PerspectiveCamera(75, window.sizes.width / window.sizes.height, 0.1, 30)
camera.position.z = 7
camera.position.y = 3
sceneGroup.add(camera)

// Create a rectangular area light
RectAreaLightUniformsLib.init()
const ceilingLight = new THREE.RectAreaLight(0x888888, 100, 1000, 1000);
ceilingLight.position.set(0, 4, 4)
ceilingLight.lookAt(0, 0, 0)
sceneGroup.add(ceilingLight)

// Sky
const starSphere = new StarSphere().addTo(sceneGroup)

// declare chart display, it has to be removed and re-added in the game loop
let chartDisplay = new ChartDisplay(sceneGroup)

const metricsDisplays = new MetricsDisplays()
sceneGroup.add(metricsDisplays)
// policy console
// the dimensions are wanted dimensions, the constructor will scale the dimensions of the model
const metricsDisplayGroupBoxSize = new THREE.Box3().setFromObject(metricsDisplays).getSize(new THREE.Vector3())
const policyConsole = new PolicyConsole({x: metricsDisplayGroupBoxSize.x, y: 1, z: 5}, {x:0, y:0.5, z:2}, sceneGroup)
// the gltfLoader loads the model asynchronously
await policyConsole.load()
// put the set of displays on top of the policy console
metricsDisplays.position.set(0, 0.89, -1.209)
const policySettingsDisplays = new PolicySettingsDisplays(sceneGroup)
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
]

// const chartDisplay = new ChartDisplay(fakeDates, sceneGroup)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// prevent the controls from looking at the bottom of the floor
controls.minPolarAngle = 1.1
controls.maxPolarAngle = 1.5
// Set limits for sideways movement
controls.minAzimuthAngle = -Math.PI / 4
controls.maxAzimuthAngle = Math.PI / 4
// Max zoom out level
controls.maxDistance = 7
// don't let the user move the objects too far, hard to get back
controls.maxTargetRadius = 7
// default position of the view
controls.target.set(0, 2, 0)
// prevent the scene from moving infinitely after the user stopped moving it
controls.enableDamping = true
controls.dampingFactor = 1
// the default for Y is unintuitive for me
controls.invertY = true;
renderer.render(scene, camera)

// event listeners

// mouse
const mouse = getMouse()
window.addEventListener('click', (event) => {
    mouse.click(camera)
})

// setters
const settersForm = document.getElementById('setters-form')
settersForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())
    // update the panels
    policySettingsDisplays.updateValues(data)
    // add to the game state
    gameState.setPolicySettings(data)
})

// window
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

// Load the environment map
// Create an RGBE loader
const rgbeLoader = new RGBELoader(window.loadingManager);

// floor
const floor = new Floor()
sceneGroup.add(floor)