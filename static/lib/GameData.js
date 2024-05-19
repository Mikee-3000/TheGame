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
        this.foodImport = 1
        this.population = 1000
        this.gdp = 1000
        this.inflationRate = 0
        this.consumerConfidence = 100
        this.investmentLevel = 1000
        this.tradeBalance = 0
        this.governmentDebt = 0
        this.unemploymentRate = 0
        this.populationGrowth = 0
    }
    getRequestData() {
        // sends only the data that the AI expects
        return {
            interestRate: this.interestRate,
            govtSpending: this.govtSpending,
            taxRate: this.taxRate,
            moneySupply: this.moneySupply,
            foodImport: this.foodImport,
            population: this.population
        }
    }
}