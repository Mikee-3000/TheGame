// keeps in-memory game data

let instance = null

export default class GameData {
    constructor() {
        if (instance) return instance
        instance = this
        // add start values
        // TODO: create a configuration file for these values
        this.interestRate = 0.05
        this.govtSpending = 1000
        this.taxRate = 0.2
        this.moneySupply = 1000
        this.foodImport = true
        this.population = 1000
        this.gdp = null
        this.inflationRate = null
        this.consumerConfidence = null
        this.investmentLevel = null
        this.tradeBalance = null
        this.unemploymentRate = null
        this.governmentDebt = null
    }
}