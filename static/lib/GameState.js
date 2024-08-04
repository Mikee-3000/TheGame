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
        // this how many real live seconds to one day
        this.gameDayInSeconds = 5
        this.scenarioId = scenarioId
        // the game starts now
        this.startTimestamp = Math.floor(Date.now() / 1000);
        // this will keep game date
        this.currentTimestamp = this.startTimestamp
        // add the current date in YYYY-MM-DD format
        this.currentDate = new Date(this.startTimestamp * 1000).toISOString().split('T')[0]
        this.lastTenDays = [this.currentDate]
        // the user's API key is needed for AI communication
        this.mistralApiKey = null
        // add start values
        this.metrics  = {}
        this.policySettings = new PolicySettings().zeroValues()
        this.setters = document.querySelector('.setters')
        this.result = 'win'
        this.setters.clicked = false
        this.gameId = null
        this.metricsList = [
           'population',
           'consumption',
           'investment',
           'netExport',
           'governmentIncome',
           'inflation',
           'unemploymentRate',
           'moneySupply',
           'governmentDebt',
           'aggregateDemand'
        ]
        this.metricsLabels = {
            'population': 'Population',
            'consumption': 'Consumption',
            'investment': 'Investment',
            'netExport': 'Net Export',
            'governmentIncome': 'Government Income',
            'inflation': 'Inflation',
            'unemploymentRate': 'Unemployment Rate',
            'moneySupply': 'Money Supply',
            'governmentDebt': 'Government Debt',
            'aggregateDemand': 'Aggregate Demand'
        }
        this.metricsDisplayClicked = null
        // measure the response time from the LLM
        this.llmRoundTripTimes = []
        this.llmAverageRoundTripTime = 0
        this.llmAverageRoundTripTimeInGameDays = 0
    }
    logLlmResponseTime(duration) {
        this.llmRoundTripTimes.push(duration)
        // average the array
        this.llmAverageRoundTripTime = this.llmRoundTripTimes.reduce((acc, cv) => acc + cv, 0) / this.llmRoundTripTimes.length
        // convert the avg to game days. 
        this.llmAverageRoundTripTimeInGameDays = (this.llmAverageRoundTripTime / 1000) / this.gameDayInSeconds
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
    getDailyMetricsAsString() {
        // returns the set of metrics for the current date
        // no color code
        return {
            population: (this.metrics[this.currentDate].population/1).toString(),
            consumption: this.metrics[this.currentDate].consumption.toFixed(2),
            investment: this.metrics[this.currentDate].investment.toFixed(2),
            netExport: this.metrics[this.currentDate].netExport.toFixed(2),
            governmentIncome: this.metrics[this.currentDate].governmentIncome.toFixed(2),
            inflation: this.metrics[this.currentDate].inflation.toFixed(2),
            unemploymentRate: this.metrics[this.currentDate].unemploymentRate.toFixed(2),
            moneySupply: this.metrics[this.currentDate].moneySupply.toFixed(2),
            governmentDebt: this.metrics[this.currentDate].governmentDebt.toFixed(2),
            aggregateDemand: this.metrics[this.currentDate].aggregateDemand.toFixed(2),
        }
    }
    colorDailyMetrics() {
        // looks up the current date in the metrics object,
        // and returns a color-coded comparison that can be used for the UI
        // if no previous metrics, color is cyan
        const colors = this.metrics[this.currentDate].compareAndColor(this.metrics[this.yesterday])
        let todaysMetrics = this.getDailyMetricsAsString()
        Object.assign(todaysMetrics, colors)
        return todaysMetrics


    }
    addDayToGameDate() {
        const date = new Date(this.currentTimestamp * 1000)
        this.yesterday = date.toISOString().split('T')[0]
        date.setDate(date.getDate() + 1);
        this.currentTimestamp = date.getTime() / 1000
        this.currentDate = date.toISOString().split('T')[0]
        // add the date to the lookup array for the chart
        this.lastTenDays.push(this.currentDate)
        if (this.lastTenDays.length > 10) {
            // keep it 10 max
            this.lastTenDays.shift()
        }
    }
    getLastTenDaysMetrics(metric) {
        let returnArray = []
        for (let day of this.lastTenDays) {
            returnArray.push(
                {
                    date: day,
                    value: this.metrics[day][metric],
                    metric: metric,
                    metricLabel: this.metricsLabels[metric]
                }
            )
        }
        return returnArray
    }
    getLastTenDaysAllMetrics() {
        let returnArray = []
        for (let day of this.lastTenDays) {
            returnArray.push(
                {
                    gt_timestamp: this.metrics[day].gtTimestamp,
                    population: this.metrics[day].population,
                    consumption: this.metrics[day].consumption,
                    investment: this.metrics[day].investment,
                    net_export: this.metrics[day].netExport,
                    government_income: this.metrics[day].governmentIncome,
                    inflation: this.metrics[day].inflation,
                    unemployment_rate: this.metrics[day].unemploymentRate,
                    moneySupply: this.metrics[day].moneySupply,
                    government_debt: this.metrics[day].governmentDebt,
                    aggregate_demand: this.metrics[day].aggregateDemand,
                }
            )
        }
        return returnArray
    }
    getDataForLlmRequest() {
        const metricsLastTenDays = this.getLastTenDaysAllMetrics()
        data = {
            game: {
                game_id: this.gameId,
                rl_timestamp: Math.floor(Date.now() / 1000)
            },
            metrics: metricsLastTenDays,
            policySettings: this.policySettings
        }
    }
}