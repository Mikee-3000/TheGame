import * as THREE from 'three'
import TextureMapText from './TextureMapText.js'

export default class RectangularDisplay {
    constructor(options) {
        this.height = options.height || 0.5
        this.width = options.width || 1
        this.text = options.text || '99999999999'
        this.canvasHeight = options.canvasHeight || 1024
        this.canvasWidth = options.canvasWidth || 2048
        this.fontFamily = options.fontFamily || 'Helvetica'
        this.textColor = options.textColor || 'white'
        this.backgroundColor = options.backgroundColor || 'black'
        this.fontSize = options.fontSize || 256
        // sides, segments
        this.geometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
        this.geometry.side = THREE.FrontSide;
        // init the text surface
        this.textureMapText = new TextureMapText(this.text,
        {
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight,
            fontFamily: this.fontFamily,
            textColor: this.textColor,
            backgroundColor: this.backgroundColor,
            fontSize: this.fontSize
        })
        this.material = new THREE.MeshBasicMaterial({ map: this.textureMapText.texture });
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        window.scene.add(this.mesh)
    }
}