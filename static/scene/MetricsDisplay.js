import * as THREE from 'three'
import TextureMapText from '../objects/TextureMapText.js'

class _TextPlane extends THREE.Mesh {
    constructor({color, text, dims, fontSize=null}) {
        const bgColor = new THREE.Color(color).toArray()
        const plane = new THREE.PlaneGeometry(dims.x, dims.y/2)
        const textureMapOptions = {
            canvasWidth: 1024 * dims.x,
            canvasHeight: 1024 * dims.y/2,
            fontFamily: 'Helvetica',
            textColor: color,
            fontSize: fontSize || 400,
            backgroundColor: 'rgba(' + bgColor.join() + ', 0.7)',
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

export default class MetricsDisplay extends THREE.Group {
    // composed of a 3d box that emits colour
    // and a 2 x 2d text display with transparent background
    constructor({
        color,
        position,
        topText,
        bottomText,
        topFontSize=300,
        bottomFontSize=400
    }) {
        super()
        // set the dimensions
        const dims = {
            x: 3,
            y: 1,
            z: 0.5
        }

        // create the 3d box
        this.box = new THREE.Mesh(
            new THREE.BoxGeometry(dims.x, dims.y, dims.z),
            new THREE.MeshLambertMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 1,
            })
        );
        // set the boxes position relative to the group
        this.box.position.set(0, 0, 0);

        // top 2d text
        this.topTextPlane = new _TextPlane({color: color, text: topText, dims: dims, fontSize: topFontSize})
        this.topTextPlane.position.set(0, dims.y/4, dims.z/2 + 0.01)
        this.bottomTextPlane = new _TextPlane({color: color, text: bottomText, dims: dims, fontSize: bottomFontSize})
        this.bottomTextPlane.position.set(0, -dims.y/4, dims.z/2 + 0.01)
        
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
}
