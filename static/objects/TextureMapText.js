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
        this.ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        // The color of the text
        this.ctx.fillStyle = options.color || '#FF0000'
        this.ctx.fillText(text, this.cnvs.width / 2, this.cnvs.height / 2)
        this.texture = new THREE.CanvasTexture(this.cnvs)
    }
    setText(text) {
        this.ctx.clearRect(0, 0, this.cnvs.width, this.cnvs.height)
        this.ctx.fillText(text, this.cnvs.width / 2, this.cnvs.height / 2)
        this.texture.needsUpdate = true
    }
}
