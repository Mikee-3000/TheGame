import * as THREE from 'three'
import  TextPlane from '/static/scene/TextPlane.js'

export default class ChartDisplay {
    constructor(scene) {
        this.scene = scene
    }
    destroy() {
        this.scene.remove(this.chartGroup)
    }
    create(data) {
        const metric = data[0].metricLabel
        // data is an array of dated values for the given metric
        let counter = 0
        // x axis - the dates
        const elements = data.length
        const gap = 0.15
        const groupWidth = 9.5
        const elementWidth = groupWidth/elements - gap
        this.chartGroup = new THREE.Group()
        // this helps calculate the position for the elments
        const helperBar = new THREE.Mesh(
            new THREE.BoxGeometry(groupWidth, 1.0, 0.5),
            new THREE.MeshStandardMaterial({
                color: 0x000000,
                metalness: 0.5,
                roughness: 0.5,
            }))
        helperBar.position.set(0, 0.3, -0.2555555)
        this.chartGroup.add(helperBar)

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
        console.log(normalizedValues)
        data.map((datum, index) => datum.normalizedValue = normalizedValues[index])
        data.forEach(datum => {
            // the date label
            const datePlane =  new TextPlane({color: 'blue', text: datum.date, dims: {x: 1, y: 0.5}, fontSize: 150, backgroundColor: 'rgba(0,0,0,0)'})
            datePlane.rotation.z = Math.PI/4
            const chartBox = new THREE.BoxGeometry(elementWidth, datum.normalizedValue, 0.1)
            const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
            const chartCube = new THREE.Mesh(chartBox, material)
            const barGroup = new THREE.Group()
            
            // the value label
            const valuePlane = new TextPlane({color: 'blue', text: datum.value.toString(), dims: {x: elementWidth, y: 0.5}, fontSize: 150, backgroundColor: 'yellow'})
            barGroup.add(valuePlane)
            barGroup.add(datePlane)
            barGroup.add(chartCube)
            chartCube.position.set(0, datum.normalizedValue/2+1, -0.05)
            datePlane.position.set(0, 0.4, 0.00)
            valuePlane.position.set(0, datum.normalizedValue + 1.2, 0.00)
            barGroup.position.set(0-groupWidth/2  + (elementWidth + gap)/2 + counter * (elementWidth + gap), 0, 0)
            this.chartGroup.add(barGroup)
            counter ++
        })
        // add label
        const labelPlane = new TextPlane({color: 'blue', text: metric, dims: {x: 5, y: 3}, fontSize: 500, backgroundColor: 'rgba(0,0,0,0)'})
        labelPlane.position.set(0, 4, 0)
        this.chartGroup.add(labelPlane)
        this.scene.add(this.chartGroup)
        const groupSize = new THREE.Box3().setFromObject(this.chartGroup).getSize(new THREE.Vector3())
        this.chartGroup.position.set(0, 1, -2.5)
    }
}