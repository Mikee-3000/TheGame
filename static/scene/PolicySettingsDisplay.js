import * as THREE from 'three'
import TextPlane from './TextPlane.js'

export default class PolicySettingsDisplay extends THREE.Group {
    constructor({
        color,
        position,
        topText,
        bottomText,
        topFontSize=150,
        bottomFontSize=150,
        dims = {
            x: 2,
            y: 0.5,
            z: 0.5
        }
    }) {
        super()
        this.box = new THREE.Mesh(
            new THREE.BoxGeometry(dims.x, dims.y, dims.z),
            new THREE.MeshStandardMaterial({
                color:color,
                metalness: 0.1,
                roughness: 0.9,
                transparent: true,
                opacity: 0.7,
            })
        )
        this.dims = dims
        this.add(this.box)
        this.position.set(position.x, position.y, position.z)
        this.textBgColor = 'rgba(0, 0, 0, 0.0)'
        // this.box.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/8)
        this.topTextPlane = new TextPlane({color: color, text: topText, dims: this.dims, fontSize: topFontSize, backgroundColor: this.textBgColor})
        this.topTextPlane.position.set(0, this.dims.y/4, this.dims.z/2 + 0.01)
        this.add(this.topTextPlane)
        this.bottomTextPlane = new TextPlane({color: color, text: bottomText, dims: this.dims, fontSize: bottomFontSize, backgroundColor: this.textBgColor})
        this.bottomTextPlane.position.set(0, -this.dims.y/4, this.dims.z/2 + 0.01)
        this.add(this.bottomTextPlane)
    }
    updateText({topText=null, bottomText=null}) {
        if (topText) {
            this.topTextPlane.setText(topText)
        }
        if (bottomText) {
            this.bottomTextPlane.setText(bottomText)
        }
    }
    updateValue(value) {
        this.updateText({bottomText: value})
    }
    addTo(scene) {
        scene.add(this)
        return this
    }
}