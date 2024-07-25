import * as THREE from 'three'
import {gltfLoader} from '../lib/loader.js'

export default class PolicyConsole {
    constructor(dimensions, position, scene) {
        this.object = gltfLoader.load('/static/scene/policySettingsConsole.glb', function (gltf) {
            scene.add(gltf.scene)
            gltf.scene.position.set(position.x, position.y, position.z)
            // get the scaling factors
            const boxSize = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3())
            const scaleX = dimensions.x / boxSize.x
            const scaleY = dimensions.y / boxSize.y
            const scaleZ = dimensions.z / boxSize.z
            gltf.scene.scale.set(scaleX, scaleY, scaleZ)
        }, undefined, function (error) {
            console.error(error);
        });
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
}