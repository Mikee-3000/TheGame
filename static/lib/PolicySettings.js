export default class PolicySettings {
    constructor(
        interestRate,
        governmentSpending,
        openMarketOperations,
        individualIncomeTax,
        corporateIncomeTax
    ) {
        this.interestRate = interestRate
        this.governmentSpending = governmentSpending
        this.openMarketOperations = openMarketOperations
        this.individualIncomeTax = individualIncomeTax
        this.corporateIncomeTax = corporateIncomeTax
    }
    zeroValues () {
        return new PolicySettings(0, 0, 0, 0, 0)
    }
}