import * as THREE from 'three'


export default class Renderer extends THREE.WebGLRenderer {
    constructor(canvas) {
        super({canvas})
        this.shadowMap.enabled = true
        this.shadowMap.type = THREE.PCFSoftShadowMap
        this.setSize(window.innerWidth, window.innerHeight)
        this.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.setClearColor('lightblue', 1)
    }
}