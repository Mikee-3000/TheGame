
import TextPlane from "./TextPlane.js"

export default class Notification extends TextPlane  {
    constructor(text) {
        super({color: 'cyan', text: 'metric', dims: {x: 5, y: 3}, fontSize: 500, backgroundColor: 'rgba(0,0,0,0)'})
        this.position.set(2, 2, 0)
        this.setText(text)
    }
    addTo(scene) {
        scene.add(this)
        return this
    }
}