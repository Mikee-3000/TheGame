export default class PolicySettings {
    constructor(
        interestRate,
        governmentSpending,
        openMarketOperations,
        individualIncomeTaxRate,
        corporateIncomeTaxRate
    ) {
        this.interestRate = interestRate
        this.governmentSpending = governmentSpending
        this.openMarketOperations = openMarketOperations
        this.individualIncomeTaxRate = individualIncomeTaxRate
        this.corporateIncomeTaxRate = corporateIncomeTaxRate
    }
    zeroValues () {
        return new PolicySettings(0, 0, 0, 0, 0)
    }
    getValuesAsStrings() {
        return {
            interestRate: this.interestRate.toString(),
            governmentSpending: this.governmentSpending.toString(),
            openMarketOperations: this.openMarketOperations.toString(),
            individualIncomeTaxRate: this.individualIncomeTaxRate.toString(),
            corporateIncomeTaxRate: this.corporateIncomeTaxRate.toString()
        }

    }
}