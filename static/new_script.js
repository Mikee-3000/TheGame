import * as THREE from 'three'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'
import TextureMapText from './objects/TextureMapText.js'
const canvas = document.querySelector('canvas.webgl')

// scene
const scene = new THREE.Scene()

// objects

const fillerColour = 0xf000ff
const readoutPanelColour = 0x000000
const readoutPanelOpacity = 0.8

class Points {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }
}

const readouts = [
    {name: 'mainPanel', dimensions : new Points(10, 10, 1), position : new Points(0, 0, 0)},
]

class BoxObject {
    constructor(dimensions, color, opacity, position) {
        this.box = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z)
        this.boxMaterial = new THREE.MeshBasicMaterial({ color: color })
        if (opacity < 1) {
            this.boxMaterial.transparent = true
            this.boxMaterial.opacity = opacity
        }
        this.mesh = new THREE.Mesh(this.box, this.boxMaterial)
        this.mesh.position.set(position.x, position.y, position.z)
        scene.add(this.mesh)
    }
}
class FillerPanel extends BoxObject {
    constructor(dimensions, position) {
        super(dimensions, fillerColour, 1, position)
    }
}
class ReadoutPanel {
    constructor(dimensions, position) {
        this.box = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z)
        this.textureMapText = new TextureMapText('99999999999',
            {
                canvasWidth: 2048,
                canvasHeight: 1024,
                fontFamily: 'Helvetica',
                color: 'green',
                fontSize: 256
            }
        )
        this.boxMaterial = new THREE.MeshBasicMaterial({ map: this.textureMapText.texture })
        this.mesh = new THREE.Mesh(this.box, this.boxMaterial)
        this.mesh.material.needsUpdate = true
        this.mesh.position.set(position.x, position.y, position.z)
        scene.add(this.mesh)
        // this.boxMaterial.map = this.textureMapText.texture
    }
}

const floor = new THREE.PlaneGeometry(100, 100)
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const floorMesh = new THREE.Mesh(floor, floorMaterial)
floorMesh.rotation.x = -Math.PI / 2
floorMesh.position.y = -0.0
scene.add(floorMesh)

const backWall = new THREE.PlaneGeometry(100, 100)
const backWallMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const backWallMesh = new THREE.Mesh(backWall, backWallMaterial)
// backWallMesh.rotation.y = Math.PI / 2
backWallMesh.position.z = -2
scene.add(backWallMesh)

const mainPanel = new ReadoutPanel(new Points(10, 5.4, 0.5), new Points(0, 2.7, -1.5))
const populationPanel = new ReadoutPanel(new Points(2, 1, 0.5), new Points(6.1, 0.5, -1.5))
const consumptionPanel = new ReadoutPanel(new Points(2, 1, 0.5), new Points(6.1, 1.6, -1.5))
const investmentPanel = new ReadoutPanel(new Points(2, 1, 0.5), new Points(6.1, 2.7, -1.5))
const netExportPanel = new ReadoutPanel(new Points(2, 1, 0.5), new Points(6.1, 3.8, -1.5))
const governmentIncomePanel = new ReadoutPanel(new Points(2, 1, 0.5), new Points(6.1, 4.9, -1.5))
const inflationPanel = new ReadoutPanel(new Points(2, 1, 0.5), new Points(-6.1, 4.9, -1.5))
const unemploymentRatePanel = new ReadoutPanel(new Points(2, 1, 0.5), new Points(-6.1, 3.8, -1.5))
const moneySupplyPanel = new ReadoutPanel(new Points(2, 1, 0.5), new Points(-6.1, 2.7, -1.5))
const governmentDebtPanel = new ReadoutPanel(new Points(2, 1, 0.5), new Points(-6.1, 1.6, -1.5))
const aggregateDemandPanel = new ReadoutPanel(new Points(2, 1, 0.5), new Points(-6.1, 0.5, -1.5))
const timePanel = new ReadoutPanel(new Points(14.2, 1, 0.5), new Points(0, 6, -1.5))
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
// scene.add(fillerPanel)

// camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// position the camera so that it's not in the same point as the cube
camera.position.z = 5
camera.position.y = 1
scene.add(camera)

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)

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
const tick = () => {
    // render
    controls.update();
    renderer.render(scene, camera)
    // call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()
