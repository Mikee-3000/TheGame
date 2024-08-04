import * as THREE from 'three'
import  TextPlane from '/static/scene/TextPlane.js'

let instance = null

export default class ChartDisplay {
    constructor(scene) {
        if (instance) {
            return instance
        }
        instance = this
        this.scene = scene
        this.create()
    }
    destroy() {
        this.scene.remove(this.chartGroup)
    }
    create() {
        this.elements = 10
        this.gap = 0.15
        this.groupWidth = 9.5
        this.elementWidth = this.groupWidth/this.elements - this.gap
        this.chartGroup = new THREE.Group()

        // this will hold the date labels
        this.dateLabelBar = new THREE.Mesh(
            new THREE.BoxGeometry(this.groupWidth, 1.0, 0.5),
            new THREE.MeshStandardMaterial({
                color: 0x000000,
                metalness: 0.5,
                roughness: 0.5,
            }))
        this.dateLabelBar.position.set(0, 0.3, -0.2555555)
        this.chartGroup.add(this.dateLabelBar)
        this.datePlanes = []
        this.chartCubes = []
        this.valuePlanes = []
        this.labelPlane = new TextPlane({color: 'cyan', text: 'metric', dims: {x: 5, y: 3}, fontSize: 500, backgroundColor: 'rgba(0,0,0,0)'})
        this.labelPlane.position.set(0, 4, 0)
        this.chartGroup.add(this.labelPlane)
        for (let i = 0; i < this.elements; i++) {
            this.barGroup = new THREE.Group()
            const datePlane =  new TextPlane({color: 'blue', text: 'N/A', dims: {x: 1, y: 0.5}, fontSize: 150, backgroundColor: 'rgba(0,0,0,0)'})
            datePlane.rotation.z = Math.PI/4
            const chartBox = new THREE.PlaneGeometry(this.elementWidth, 1)
            const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
            const chartCube = new THREE.Mesh(chartBox, material)
            const valuePlane = new TextPlane({color: 'blue', text: 'N/A', dims: {x: this.elementWidth, y: 0.5}, fontSize: 150, backgroundColor: 'yellow'})
            this.barGroup.add(valuePlane)
            this.barGroup.add(datePlane)
            this.barGroup.add(chartCube)
            this.valuePlanes.push(valuePlane)
            this.datePlanes.push(datePlane)
            this.chartCubes.push(chartCube)

            chartCube.position.set(0, 1/2+1, -0.05)
            datePlane.position.set(0, 0.4, 0.00)
            valuePlane.position.set(0, 1 + 1.2, 0.00)
            this.barGroup.position.set(0-this.groupWidth/2  + (this.elementWidth + this.gap)/2 + i * (this.elementWidth + this.gap), 0, 0)
            this.chartGroup.add(this.barGroup)
        }
        this.scene.add(this.chartGroup)
        this.chartGroup.position.set(0, 1, -2.5)
    }
    update(data) {
        const metricLabel = data[0].metricLabel
        const metric = data[0].metric
        // y axis - the values, normalized from 0 to 2
        const maxY = 2
        // get the list of values from the maps
        const values = data.map(datum => datum.value)
        // calculate minimum value
        const min = Math.min(...values)
        // shift min to 0 so that 0 is the minimum value
        const shiftedValues = values.map(value => value - (0 + min))
        // get the new maximum
        const max = Math.max(...shiftedValues)
        let normalizedValues  = []
        // if max is 0, than all the values are the same, and we can't do the calculation
        if (max === 0) {
            normalizedValues = shiftedValues.map(value => 1)
        } else {
            // normalize so that it fits into the space
            normalizedValues = shiftedValues.map(value => 0 + value/max * maxY)
        }
        data.map((datum, index) => {
            datum.normalizedValue = normalizedValues[index]
            this.chartCubes[index].scale.set(1, datum.normalizedValue, 1)
            this.chartCubes[index].position.set(0, datum.normalizedValue/2+1, -0.05)
            if (metric !== 'population') {
                this.valuePlanes[index].setText(datum.value.toFixed(2))
            } else {
                this.valuePlanes[index].setText(datum.value.toString())
            }
            this.valuePlanes[index].position.set(0, datum.normalizedValue + 1.2, 0.00)
            this.datePlanes[index].setText(datum.date)

        })
        this.labelPlane.setText(metricLabel)
    }
}