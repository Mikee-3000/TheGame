import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from '../node_modules/three/examples/jsm/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader(window.loadingManager)
dracoLoader.setDecoderPath('static/draco/')
const gltfLoader = new GLTFLoader(window.loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

export {gltfLoader}
