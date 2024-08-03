import Metrics from './Metrics.js'
import PolicySettings from './PolicySettings.js'

let instance = null

export default class GameState {
    constructor(scenarioId) {
        if (instance) return instance
        if (scenarioId === null) {
            // this is not supposed to happen
            console.error('GameState failed to initialize on time')
            throw new Error('GameState failed to initialize on time')
        }
        instance = this
        this.scenarioId = scenarioId
        // the game starts now
        this.startTimestamp = Math.floor(Date.now() / 1000);
        // this will keep game date
        this.currentTimestamp = this.startTimestamp
        // add the current date in YYYY-MM-DD format
        this.currentDate = new Date(this.startTimestamp * 1000).toISOString().split('T')[0]
        // the user's API key is needed for AI communication
        this.mistralApiKey = null
        // add start values
        this.metrics  = {}
        this.policySettings = new PolicySettings().zeroValues()
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
            for (const key in this.policySettings) {
                document.getElementById(key).value = this.policySettings[key]
            }
            this.setters.clicked = true
        } else {
            this.setters.style.display = 'none'
            this.setters.clicked = false
        }
    }
    setMetrics(metrics){
        // add the new data
        // if there is old data with the same key, it will be overwritten
        for (let key in metrics) {
            const newMetrics = metrics[key]
            // the keys in objects returned by the API are not sorted,
            // the constructor assignments need to be explicit
            this.metrics[key] = new Metrics(
                newMetrics.gt_timestamp,
                newMetrics.population,
                newMetrics.consumption,
                newMetrics.investment,
                newMetrics.net_export,
                newMetrics.government_income,
                newMetrics.inflation,
                newMetrics.unemployment_rate,
                newMetrics.money_supply,
                newMetrics.government_debt,
                newMetrics.aggregate_demand
            )
        }
    }
    setPolicySettings(data){
        this.policySettings = new PolicySettings(
            parseFloat(data.interestRate),
            parseFloat(data.governmentSpending),
            parseFloat(data.openMarketOperations),
            parseFloat(data.individualIncomeTaxRate),
            parseFloat(data.corporateIncomeTaxRate),
        )
    }
    addDayToGameDate() {
        const date = new Date(this.currentTimestamp * 1000)
        date.setDate(date.getDate() + 1);
        this.currentTimestamp = date.getTime() / 1000
        this.currentDate = date.toISOString().split('T')[0]
    }
}