export default class Metrics {
    constructor(
        gt_timestamp,
        population,
        consumption,
        investment,
        net_export,
        government_income,
        inflation,
        unemployment_rate,
        money_supply,
        government_debt,
        aggregate_demand
    ){
        this.gtTimestamp = gt_timestamp
        this.population = population
        this.consumption = consumption
        this.investment = investment
        this.netExport = net_export
        this.governmentIncome = government_income
        this.inflation = inflation
        this.unemploymentRate = unemployment_rate
        this.moneySupply = money_supply
        this.governmentDebt = government_debt
        this.aggregateDemand = aggregate_demand
    }
    timestampToDate(){
        return new Date(this.gtTimestamp * 1000).toISOString().split('T')[0]
    }
    compareAndColor(compareTo) {
        return {
            populationColor: this.population === compareTo.population ? 'cyan' : this.population > compareTo.population ? 'green' : 'red',
            consumptionColor: this.consumption === compareTo.consumption ? 'cyan' : this.consumption > compareTo.consumption ? 'green' : 'red',
            investmentColor: this.investment === compareTo.investment ? 'cyan' : this.investment > compareTo.investment ? 'green' : 'red',
            netExportColor: this.netExport === compareTo.netExport ? 'cyan' : this.netExport > compareTo.netExport ? 'green' : 'red',
            governmentIncomeColor: this.governmentIncome === compareTo.governmentIncome ? 'cyan' : this.governmentIncome > compareTo.governmentIncome ? 'green' : 'red',
            inflationColor: this.inflation === compareTo.inflation ? 'cyan' : this.inflation > compareTo.inflation ? 'red' : 'green',
            unemploymentRateColor: this.unemploymentRate === compareTo.unemploymentRate ? 'cyan' : this.unemploymentRate > compareTo.unemploymentRate ? 'red' : 'green',
            moneySupplyColor: this.moneySupply === compareTo.moneySupply ? 'cyan' : this.moneySupply > compareTo.moneySupply ? 'green' : 'red',
            governmentDebtColor: this.governmentDebt === compareTo.governmentDebt ? 'cyan' : this.governmentDebt > compareTo.governmentDebt ? 'red' : 'green',
            aggregateDemandColor: this.aggregateDemand === compareTo.aggregateDemand ? 'cyan' : this.aggregateDemand > compareTo.aggregateDemand ? 'green' : 'red',
        }
    }
}
