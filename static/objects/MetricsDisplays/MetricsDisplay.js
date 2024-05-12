import * as THREE from 'three'
import TextureMapText from '../TextureMapText.js'

export default class MetricsDisplay {
    constructor() {
        // sides, segments
        this.geometry = new THREE.PlaneGeometry(1, 0.5, 1, 1);
        this.geometry.side = THREE.FrontSide;
        // init the text surface
        this.textureMapText = new TextureMapText('99999999999',
        {
            canvasWidth: 2048,
            canvasHeight: 1024,
            fontFamily: 'Helvetica',
            textColor: 'yellow',
            backgroundColor: 'fuchsia',
            fontSize: 256
        })
        this.material = new THREE.MeshBasicMaterial({ map: this.textureMapText.texture });
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        window.scene.add(this.mesh)
    }
}