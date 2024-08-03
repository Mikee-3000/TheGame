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
}
