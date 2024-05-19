import * as THREE from 'three'
import MetricsDisplay from './MetricsDisplay.js'
import GameData from '../../lib/GameData.js'
import TextSprite from '../TextSprite.js'

// singleton
let instance = null
export default class Displays {
    constructor() {
        if (instance) return instance
        instance = this
        // this.metricsDisplay = new MetricsDisplay()
        this.gameData = new GameData()
        // iterate over the game data and create a display for each metric
        this.updateDisplays()
    }
    updateDisplays() {
        let i = 0 - Object.keys(this.gameData).length/2
        for (const [metric, value] of Object.entries(this.gameData)) {
            this[metric] = new MetricsDisplay()
            this[metric].mesh.position.set(1.1*i, 9, -2.5)
            this[metric].textureMapText.setText(value)
            this[metric].textSprite = new TextSprite(metric, new THREE.Vector3(0.0, 0.3, 0.1), this[metric].mesh, {font: 'bold 35px Helvetica', fontColor: 'darkblue'})
            i++
        }

    }
}