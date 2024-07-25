import MetricsDisplay from '../scene/MetricsDisplay.js'

export default class GameDateDisplay extends MetricsDisplay {
    constructor() {
        // Call the parent constructor
        super(
            {
                topText: 'Date',
                bottomText: '0000-00-00',
                color: 'magenta',
                position: {x: 0, y: 6.01, z: -1.5}
            }
        )
    }
}