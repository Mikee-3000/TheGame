import * as THREE from 'three'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from './node_modules/three/examples/jsm/loaders/RGBELoader.js'

import TextureMapText from './objects/TextureMapText.js'
const canvas = document.querySelector('canvas.webgl')
import FixedText from './objects/FixedText.js'
import { FontLoader } from './node_modules/three/examples/jsm/loaders/FontLoader.js'
import { RectAreaLightHelper } from './node_modules/three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from './node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import MetricsDisplay from './scene/MetricsDisplay.js'


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
// rectLight.power = 1000;

// Set the position and rotation of the light
rectLight.position.set(0, 3.25, 20.5);
// rectLight.rotation.y = Math.PI 
// Create a rectangular light helper
const rectLightHelper = new RectAreaLightHelper(rectLight);

// Add the light helper to the scene
// sceneGroup.add(rectLightHelper);

// Add the light to the scene
rectLight.lookAt(0, 3.25, -10.5)
// rectLight.lookAt(0, 3.25, 100.6)
// sceneGroup.add(rectLight);
// sceneGroup.add(rectLight)

// Create an RGBE loader
const rgbeLoader = new RGBELoader();

// Load the HDR image
let envMap = null
rgbeLoader.load('/static/textures/HDR_blue_nebulae-1.hdr', (texture) => {
// rgbeLoader.load('/static/textures/starry_sky.jpeg', (texture) => {
    // Pre-filter the HDR image
    texture.rotation = 45
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    envMap = pmremGenerator.fromEquirectangular(texture).texture;

    // Set the environment map of the scene
    
    scene.environment = envMap;

    scene.background = envMap
    console.log(scene.background)
    scene.background.rotation = 45
});

console.log(scene.background)
// objects

const loadingManager = new THREE.LoadingManager();
// Create a font loader
const fontLoader = new FontLoader(loadingManager);
// Load the font
let font;
let fixedText = null
fontLoader.load('/static/objects/fonts/gentilis/gentilis_bold.typeface.json', (loadedFont) => {
    font = loadedFont;
    fixedText = new FixedText(new THREE.Vector3(0, 0, 0), 'DON\'T PANIC!', font)
    console.log(fixedText.textObject)
    sceneGroup.add(fixedText.textObject)
    
    console.log(font)
});

const textureLoader = new THREE.TextureLoader(loadingManager)
const starrySky = textureLoader.load('/static/textures/starry_sky.jpeg')
starrySky.colorSpace = THREE.SRGBColorSpace
const whiteRect = textureLoader.load('/static/textures/whiterect.png')
starrySky.repeat.set(5, 5)
starrySky.wrapS = THREE.RepeatWrapping
starrySky.wrapT = THREE.RepeatWrapping


const fillerColour = 0x584848
const readoutPanelColour = 'black'
const readoutPanelOpacity = 0.9

class Points {
    constructor(x, y, z=null) {
        this.x = x
        this.y = y
        this.z = z
    }
}

class BoxObject {
    constructor(dimensions, color, opacity, position) {
        this.box = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z)
        this.boxMaterial = new THREE.MeshLambertMaterial({
            color: color,
            // depthWrite: false,
            // alphaTest: 0.5,
            // roughness: 0.1,
            // metalness: 1,
            emissive: color,
            emissiveIntensity: 100
        })
        if (opacity < 1) {
            this.boxMaterial.transparent = true
            this.boxMaterial.opacity = opacity
        }
        this.mesh = new THREE.Mesh(this.box, this.boxMaterial)
        this.mesh.position.set(position.x, position.y, position.z)
        sceneGroup.add(this.mesh)
    }
}
class FillerPanel {
    constructor(dimensions, position) {
        this.box = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z)
        this.boxMaterial = new THREE.MeshStandardMaterial({
            color: fillerColour,
            // depthWrite: false,
            // alphaTest: 0.5,
            roughness: 0.1,
            metalness: 1,
            // emissive: fillerColour,
            // emissiveIntensity: 10000
        })
        this.mesh = new THREE.Mesh(this.box, this.boxMaterial)
        this.mesh.position.set(position.x, position.y, position.z)
        sceneGroup.add(this.mesh)
    }
    
}

class ReadoutPanel {
    constructor(property, label, dimensions, position, color='black') {
        this.box = new BoxObject(dimensions, color, 1, position)
        this.planeTop = new THREE.PlaneGeometry(dimensions.x, dimensions.y/2)
        this.planeBottom = new THREE.PlaneGeometry(dimensions.x, dimensions.y/2)
        this.textureMapOptionsTop = {
            canvasWidth: 3072,
            canvasHeight: 1024,
            fontFamily: 'Helvetica',
            // textColor: 'rgba(0, 0, 0, 0.1)',
            textColor: 'red',
            fontSize: 400,
            backgroundColor: 'rgba(0, 0, 0, .1)',
        }
        this.textureMapOptionsBottom = {
            canvasWidth: 3072,
            canvasHeight: 1024,
            fontFamily: 'Helvetica',
            textColor: 'green',
            fontSize: 400,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }
        this.textureMapTextTop = new TextureMapText(label, this.textureMapOptionsTop)
        this.textureMapOptionsTop.colorSpace = THREE.SRGBColorSpace
        this.textureMapTextBottom = new TextureMapText('99999999999', this.textureMapOptionsBottom)
        this.textureMapOptionsBottom.colorSpace = THREE.SRGBColorSpace
        this.materialTop = new THREE.MeshStandardMaterial({
        // this.materialTop = new THREE.MeshLambertMaterial({
            map: this.textureMapTextTop.texture,
            envMap:envMap,
            envMapIntensity: 1,
            transparent: true,
            // opacity: 0,
            // side: THREE.DoubleSide,
            // side: THREE.DoubleSide,
            metalness: 1,
            roughness: 0.1
        })
        this.materialBottom = new THREE.MeshStandardMaterial({
            map: this.textureMapTextBottom.texture,
            envMap:envMap,
            envMapIntensity: 1,
            transparent: true,
            side: THREE.DoubleSide,
            metalness: 0.1,
            roughness: 0.1
        })
        this.meshTop = new THREE.Mesh(this.planeTop, this.materialTop)
        this.meshBottom = new THREE.Mesh(this.planeBottom, this.materialBottom)
        this.meshTop.material.needsUpdate = true
        this.meshBottom.material.needsUpdate = true
        this.meshTop.position.set(position.x, position.y+dimensions.y/4, position.z + .26)
        this.meshBottom.position.set(position.x, position.y-dimensions.y/4, position.z + .26)
        this.meshBottom.receiveShadow = false
        sceneGroup.add(this.meshTop)
        sceneGroup.add(this.meshBottom)
        // this.boxMaterial.map = this.textureMapText.texture
    }
}

// earth
const earthTexture = textureLoader.load('/static/textures/earth.png', (texture) => {
    const geometry = new THREE.SphereGeometry( 1.5, 32, 16 )
    const material = new THREE.MeshBasicMaterial( { map: texture } )
    const sphere = new THREE.Mesh( geometry, material )
    sceneGroup.add( sphere )
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
})

const floor = new THREE.PlaneGeometry(10000, 10000)
const floorMaterial = new THREE.MeshStandardMaterial({
    // color: 0x2f1555,
    color: 0x1b0825,
    envMap:envMap,
    envMapIntensity: 1,
    roughness: 0.1,
    metalness: 1,
    transparent: false,
    opacity: 0.9
})
const floorMesh = new THREE.Mesh(floor, floorMaterial)
floorMesh.rotation.x = -Math.PI / 2
floorMesh.position.y = -0.0
sceneGroup.add(floorMesh)

const ceilingLight = new THREE.RectAreaLight(0x888888, 100, 1000, 1000);
ceilingLight.position.set(0, 5, 0)
ceilingLight.lookAt(0, 0, 0)
// sceneGroup.add(ceilingLight)
sceneGroup.add(ceilingLight)

const backWall = new THREE.PlaneGeometry(100, 100)
const backWallMaterial = new THREE.MeshBasicMaterial({ map: starrySky})
const backWallMesh = new THREE.Mesh(backWall, backWallMaterial)
// backWallMesh.rotation.y = Math.PI / 2
backWallMesh.position.z = -2
// sceneGroup.add(backWallMesh)

const mainPanel = new ReadoutPanel('main', null, new Points(10, 5.4, 0.5), new Points(0, 2.7, -1.5), 0x2f1555)
// const populationPanel = new ReadoutPanel('population', 'Population', new Points(3, 1, 0.5), new Points(6.6, 0.5, -1.5), 'blue')
// const consumptionPanel = new ReadoutPanel('consumption', 'Consumption', new Points(2, 1, 0.5), new Points(6.1, 1.6, -1.5), 'yellow')
// const investmentPanel = new ReadoutPanel('investment', 'Investment', new Points(2, 1, 0.5), new Points(6.1, 2.7, -1.5), 'black')
// const netExportPanel = new ReadoutPanel('netExport', 'Net Export', new Points(2, 1, 0.5), new Points(6.1, 3.8, -1.5), 'gold')
// const governmentIncomePanel = new ReadoutPanel('governmentIncome', 'Government Income', new Points(2, 1, 0.5), new Points(6.1, 4.9, -1.5))
// const inflationPanel = new ReadoutPanel('inflation', 'Inflation', new Points(2, 1, 0.5), new Points(-6.1, 4.9, -1.5))
// const unemploymentRatePanel = new ReadoutPanel('unemployment', 'Unemployment', new Points(2, 1, 0.5), new Points(-6.1, 3.8, -1.5))
// const moneySupplyPanel = new ReadoutPanel('moneySupply', 'Money Supply', new Points(2, 1, 0.5), new Points(-6.1, 2.7, -1.5))
// const governmentDebtPanel = new ReadoutPanel('governmentDebt', 'Government Debt', new Points(2, 1, 0.5), new Points(-6.1, 1.6, -1.5))
// const aggregateDemandPanel = new ReadoutPanel('aggregateDemand', 'Aggregate Demand', new Points(2, 1, 0.5), new Points(-6.1, 0.5, -1.5))
// const timePanel = new ReadoutPanel('time', null, new Points(14.2, 1, 0.5), new Points(0, 6, -1.5))
const populationPanel = new MetricsDisplay('green', {x: 6.6, y: 0.5, z: -1.5}, 'Population', '3')
sceneGroup.add(populationPanel)
const fillerCentres = [1.05, 2.15, 3.25, 4.35]
for (const f of fillerCentres) {
    new FillerPanel(new Points(2, 0.1, 0.5), new Points(-6.1, f, -1.5))
    new FillerPanel(new Points(2, 0.1, 0.5), new Points(6.1, f, -1.5))
}
new FillerPanel(new Points(0.1, 5.4, 0.5), new Points(-5.05, 2.7, -1.5))
new FillerPanel(new Points(0.1, 5.4, 0.5), new Points(5.05, 2.7, -1.5))
new FillerPanel(new Points(14.2, 0.1, 0.5), new Points(0, 5.45, -1.5))


// const fillerPanel = boxObject(10, 0.1, 0.5, 0xf000ff, 1)
// fillerPanel.position.set(0, 5.45, -1.5)
// sceneGroup.add(fillerPanel)

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// position the camera so that it's not in the same point as the cube
camera.position.z = 10
camera.position.y = 3
camera.far = 50
sceneGroup.add(camera)




const ambientLight = new THREE.AmbientLight(0xffffff, 10) // color, intensity
const pointLight = new THREE.PointLight(0xffffff, 1000)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
pointLight.lookAt(0, 2.7, -1.5)
// sceneGroup.add(ambientLight, pointLight)
// sceneGroup.add(ambientLight)


// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// prevent the controls from looking at the bottom of the floor
// controls.minPolarAngle = 1.1;
// controls.maxPolarAngle = 1.5;
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
    
    populationPanel.bottomTextPlane.text.setText(counter.toString())
    
    fixedText = new FixedText(new THREE.Vector3(0, 0, 0), counter, font)
    // if (fixedText != null && counter % 10 == 0) {
    //     console.log(fixedText)
    //     fixedText.textGeometry.dispose()
    //     fixedText.textGeometry.text = 'Goodbye, world! ' + counter;
    //     fixedText.textGeometry.computeBoundingBox();
    //     // fixedText.textMaterial.map = fixedText.textGeometry.texture
    //     fixedText.textMaterial = new THREE.MeshBasicMaterial({ color: 'darkblue' })
    //     fixedText.textMaterial.needsUpdate = true
    //     fixedText.textObject = new THREE.Mesh(fixedText.textGeometry, fixedText.textMaterial)
    // }
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
