import * as THREE from 'three'

// creates a texture with text that can be mapped to an object
// the text can be updated

export default class TextureMapText {
    constructor( text='Hello World', options={}) {
        this.cnvs = document.createElement('canvas')
        this.ctx = this.cnvs.getContext('2d')
        // the canvas size must be a power of 2, the higher the resolution the better the text quality, but the more memory it will consume
        this.cnvs.width = options.canvasWidth || 4096
        this.cnvs.height = options.canvasHeight || 4096
        this.fontSize = options.fontSize || 512
        this.fontFamily = options.fontFamily || 'Arial'
        this.fontWeight = options.fontWeight || 'bold'
        this.textColor = options.textColor || 'white'
        this.backgroundColor = options.backgroundColor || 'black'
        this.ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`
        // don't update the texture on first run, there isn't any 
        this.setText(text, false)
        this.texture = new THREE.CanvasTexture(this.cnvs)
        this.texture.needsUpdate = true
    }
    setText(text, updateTexture=true) {
        this.ctx.clearRect(0, 0, this.cnvs.width, this.cnvs.height)
        // Set the canvas background color 
        this.ctx.fillStyle = this.backgroundColor
        // console.log(this.backgroundColor)
        this.ctx.fillRect(0, 0, this.cnvs.width, this.cnvs.height)
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        // The color of the text
        this.ctx.fillStyle = this.textColor
        this.ctx.fillText(text, this.cnvs.width / 2, this.cnvs.height / 2)
        if (updateTexture) {
            this.texture.needsUpdate = true
        }
    }
}
