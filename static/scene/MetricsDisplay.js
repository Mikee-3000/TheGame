import * as THREE from 'three'
import TextPlane from './TextPlane.js'

export default class MetricsDisplay extends THREE.Group {
    // composed of a 3d box that emits color
    // and a 2 x 2d text display with transparent background
    constructor({
        color,
        position,
        topText,
        bottomText,
        topFontSize=270,
        bottomFontSize=400,
        dims = {
            x: 3,
            y: 1,
            z: 0.5
        }
    }) {
        super()
        // set the dimensions
        this.dims = dims
        // create the 3d box
        this.box = new THREE.Mesh(
            new THREE.BoxGeometry(this.dims.x, this.dims.y, this.dims.z),
            new THREE.MeshLambertMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 1,
            })
        );
        // set the boxes position relative to the group
        this.box.position.set(0, 0, 0);

        // top 2d text
        this.topTextPlane = new TextPlane({color: color, text: topText, dims: this.dims, fontSize: topFontSize})
        this.topTextPlane.position.set(0, this.dims.y/4, this.dims.z/2 + 0.01)
        this.bottomTextPlane = new TextPlane({color: color, text: bottomText, dims: this.dims, fontSize: bottomFontSize})
        this.bottomTextPlane.position.set(0, -this.dims.y/4, this.dims.z/2 + 0.01)
        
        // add the box and text to the group
        this.add(this.box)
        this.add(this.topTextPlane)
        this.add(this.bottomTextPlane)
        this.position.set(position.x, position.y, position.z);
    }
    updateText({topText=null, bottomText=null}) {
        if (topText) {
            this.topTextPlane.setText(topText)
        }
        if (bottomText) {
            this.bottomTextPlane.setText(bottomText)
        }
    }
    updateColor(color) {
        this.box.material.color.set(color)
        this.box.material.emissive.set(color)
        this.topTextPlane.setTextColor(color)
        this.bottomTextPlane.setTextColor(color)
    }
    addTo(scene) {
        scene.add(this)
        return this
    }
}
