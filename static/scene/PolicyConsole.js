import * as THREE from 'three'
import {gltfLoader} from '../lib/loader.js'

export default class PolicyConsole {
    constructor(dimensions, position, scene) {
        this.dimensions = dimensions
        this.position = position
        this.scene = scene
        this.object = null
    }
    async load () {
        await gltfLoader.loadAsync('/static/scene/policySettingsConsole.glb').then((gltf) => {
            this.scene.add(gltf.scene)
            this.object = gltf.scene
            // gltf.scene.position.set(this.position.x, this.position.y, this.position.z)
            this.object.position.set(this.position.x, this.position.y, this.position.z)
            // get the scaling factors
            const boxSize = new THREE.Box3().setFromObject(this.object).getSize(new THREE.Vector3())
            const scaleX = this.dimensions.x / boxSize.x
            const scaleY = this.dimensions.y / boxSize.y
            const scaleZ = this.dimensions.z / boxSize.z
            this.object.scale.set(scaleX, scaleY, scaleZ)
        }).then(() => {
            return this
        }).catch((error) => {
            console.error(error)
        })
    }
    //     this.box = new three.boxgeometry(dimensions.x, dimensions.y, dimensions.z)
    //     this.boxmaterial = new three.meshstandardmaterial({
    //         color: 'black',
    //         roughness: 0.5,
    //         metalness: 0.5,
    //     })
    //     this.mesh = new three.mesh(this.box, this.boxmaterial)
    //     this.mesh.position.set(position.x, position.y, position.z)
    // }
}