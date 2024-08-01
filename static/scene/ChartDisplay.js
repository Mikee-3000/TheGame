import * as THREE from 'three'
import  TextPlane from '/static/scene/TextPlane.js'

export default class ChartDisplay {
    constructor(data, scene) {
        // data is an array of dated values for the given metric
        let counter = 0
        // x axis - the dates
        const elements = data.length
        const gap = 0.15
        const groupWidth = 9.5
        const elementWidth = groupWidth/elements - gap
        const chartGroup = new THREE.Group()
        // this helps calculate the position for the elments
        const helperBar = new THREE.Mesh(
            new THREE.BoxGeometry(groupWidth, 1.0, 0.5),
            new THREE.MeshStandardMaterial({
                color: 0x000000,
                metalness: 0.5,
                roughness: 0.5,
            }))
        helperBar.position.set(0, 0.3, -0.2555555)
        chartGroup.add(helperBar)

        // y axis - the values, normalized from 0 to 5
        const maxY = 2
        // get the list of values from the maps
        const values = data.map(datum => datum.value)
        // calculate minimum value
        const min = Math.min(...values)
        // shift min to 0 so that 0 is the minimum value
        const shiftedValues = values.map(value => value - (0 + min))
        // get the new maximum
        const max = Math.max(...shiftedValues)
        // normalize so that it fits into the space
        const normalizedValues = shiftedValues.map(value => 0 + value/max * maxY)
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
            chartGroup.add(barGroup)
            counter ++
        })
        scene.add(chartGroup)
        const groupSize = new THREE.Box3().setFromObject(chartGroup).getSize(new THREE.Vector3())
        chartGroup.position.set(0, 1, -2.5)
    }
}