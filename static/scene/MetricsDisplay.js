import * as THREE from 'three'
import TextureMapText from '../objects/TextureMapText.js'

class _TextPlane extends THREE.Mesh {
    constructor(colour, text, dims) {
        const plane = new THREE.PlaneGeometry(dims.x, dims.y/2)
        const textureMapOptions = {
            canvasWidth: 1024 * dims.x,
            canvasHeight: 1024 * dims.y/2,
            fontFamily: 'Helvetica',
            textColor: colour,
            fontSize: 400,
            backgroundColor: 'rgba(0, 0, 0, .5)',
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
}

export default class MetricsDisplay extends THREE.Group {
    // composed of a 3d box that emits colour
    // and a 2 x 2d text display with transparent background
    constructor(
        colour,
        position,
        topText,
        bottomText
    ) {
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
                color: colour,
                emissive: colour,
                emissiveIntensity: 1,
            })
        );
        // set the boxes position relative to the group
        this.box.position.set(0, 0, 0);

        // top 2d text
        this.topTextPlane = new _TextPlane(colour, topText, dims)
        this.topTextPlane.position.set(0, dims.y/4, dims.z/2 + 0.01)
        this.bottomTextPlane = new _TextPlane(colour, bottomText, dims)
        this.bottomTextPlane.position.set(0, -dims.y/4, dims.z/2 + 0.01)
        
        // add the box and text to the group
        this.add(this.box)
        this.add(this.topTextPlane)
        this.add(this.bottomTextPlane)
        this.position.set(position.x, position.y, position.z);
    }
}
