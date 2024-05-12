import * as THREE from 'three'
import RectangularDisplay from './Display.js'

export default class Calendar {
    constructor() {
        this.realTimeClock = new THREE.Clock()
        this.realTimeClock.start()
        this.startDate = new Date('1900-01-01 00:00:00 GMT+0000')
        // this.currentDate = this.startDate // this is a reference, not a copy
        this.currentDate = new Date('1900-01-01 00:00:00 GMT+0000')
        this.lastUpdate = 0
        this.display = new RectangularDisplay({
            text : this.currentDate.toLocaleDateString(),
            height : 1,
            width : 4,
            canvasHeight : 1024,
            canvasWidth : 4096,
            fontFamily : 'Helvetica',
        })
        this.display.mesh.position.set(-5, 11, 0)
    }
    dateUpdate() {
        let elapsedTime = this.realTimeClock.getElapsedTime()
        if (elapsedTime - this.lastUpdate >= 1) { 
            this.currentDate.setDate(this.currentDate.getDate() + 1)
            this.lastUpdate = elapsedTime
            this.display.textureMapText.setText(this.currentDate.toLocaleDateString())
        }
        return this.currentDate
    }

}