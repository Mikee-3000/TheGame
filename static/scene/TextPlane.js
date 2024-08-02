import * as THREE from 'three'
import TextureMapText from './TextureMapText.js'

export default class TextPlane extends THREE.Mesh {
    constructor({color, text, dims, fontSize=null, backgroundColor=null}) {
        const bgColor = new THREE.Color(color).toArray()
        const plane = new THREE.PlaneGeometry(dims.x, dims.y/2)
        const textureMapOptions = {
            canvasWidth: 1024 * dims.x,
            canvasHeight: 1024 * dims.y/2,
            fontFamily: 'Helvetica',
            textColor: color,
            fontSize: fontSize || 400,
            backgroundColor: backgroundColor || 'rgba(' + bgColor.join() + ', 0.7)'
        }
        const textureMapText = new TextureMapText(text, textureMapOptions)
        textureMapOptions.colorSpace = THREE.SRGBColorSpace
        const material = new THREE.MeshBasicMaterial({
            map: textureMapText.texture,
            transparent: true
        })
        super(plane, material)
        this.text = textureMapText
    }
    setText(text) {
        this.text.update({text: text})
    }
    setTextColor(color) {
        this.text.update({textColor: color})
    }

}