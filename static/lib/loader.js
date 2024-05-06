import {DRACOLoader, GLTFLoader} from './base.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('static/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

export {gltfLoader}

