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
            interestRate: this.interestRate.toFixed(2),
            governmentSpending: this.governmentSpending.toFixed(2),
            openMarketOperations: this.openMarketOperations.toFixed(2),
            individualIncomeTaxRate: this.individualIncomeTaxRate.toFixed(2),
            corporateIncomeTaxRate: this.corporateIncomeTaxRate.toFixed(2)
        }
    }
    getValuesForLlmJson() {
        // the API expects snake_case rather than camelCase
        return {
            interest_rate: this.interestRate,
            government_spending: this.governmentSpending,
            open_market_operations: this.openMarketOperations,
            individual_tax_rate: this.individualIncomeTaxRate,
            corporate_tax_rate: this.corporateIncomeTaxRate
        }
    }
}