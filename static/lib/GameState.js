import Metrics from './metrics.js'
import PolicySettings from './PolicySettings.js'

let instance = null

export default class GameState {
    constructor(scenarioId) {
        if (instance) return instance
        instance = this
        this.scenarioId = scenarioId
        // the game starts now
        this.startTimestamp = Math.floor(Date.now() / 1000);
        // the user's API key is needed for AI communication
        this.mistralApiKey = null
        // add start values
        this.metrics  = {}
        this.policySettings = PolicySettings().zeroValues()
        this.setters = document.querySelector('.setters')
        this.result = 'win'
        this.setters.clicked = false
        this.gameId = null

    }
    getRequestData() {
        // sends only the data that the AI expects
        return {
        }
    }
    toggleSetters() {
        // toggles the setters on and off
        if (this.setters.style.display === 'none' || this.setters.style.display === '') {
            this.setters.style.display = 'block'
            this.setters.clicked = true
        } else {
            this.setters.style.display = 'none'
            this.setters.clicked = false
        }
    }
    setMetrics(metrics){
        // delete the previous data first
        this.metrics = {}
        // add the new data
        for (key in metrics) {
            this.metrics[key] = new Metrics(...Object.values(metrics[key]))
        }
    }
}