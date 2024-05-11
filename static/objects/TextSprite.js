import * as THREE from 'three'

// suitable for text that needs to be changed and tied to a parent object
// will always face the camera, so not good for text integrated into the world.

export default class TextSprite {
    constructor(text, position, parentObject) {
        this.text = text
        this.position = position
        this.parentObject = parentObject
        this.build()
    }
    build() {
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.ctx.font = 'bold 48px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2)
        this.texture = new THREE.CanvasTexture(this.canvas)
        this.material = new THREE.SpriteMaterial({ map: this.texture })
        this.sprite = new THREE.Sprite(this.material)
        this.sprite.position.set(this.position.x, this.position.y, this.position.z)
        // removes the canvas from the DOM and adds the sprite to the scene
        this.canvas.remove()
        this.parentObject.add(this.sprite)
        // window.scene.add(this.sprite)
        
    }
    setText(text) {
        // changes the text and rebuilds the sprite
        this.parentObject.remove(this.sprite)
        this.text = text
        this.texture.needsUpdate = true
        this.build()
    }

}