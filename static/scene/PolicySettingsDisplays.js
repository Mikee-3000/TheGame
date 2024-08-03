import PolicySettingsDisplay from "./PolicySettingsDisplay.js"
import { Points } from "../lib/utils.js"

export default class PolicySettingsDisplays {
    constructor(sceneGroup) {
        const policySettingsDisplayColor = 'black'
        this.interestRatePanel = new PolicySettingsDisplay({color: policySettingsDisplayColor, position: new Points(6, 0.9, -1), topText: 'Interest Rate'}).addTo(sceneGroup)
        this.governmentSpendingPanel = new PolicySettingsDisplay({color: policySettingsDisplayColor, position: new Points(3, 0.9, -1), topText: 'Government Spending'}).addTo(sceneGroup)
        this.openMarketOperations = new PolicySettingsDisplay({color: policySettingsDisplayColor, position: new Points(0, 0.9, -1), topText: 'Open Market Operations'}).addTo(sceneGroup)
        this.individualIncomeTaxRate = new PolicySettingsDisplay({color: policySettingsDisplayColor, position: new Points(-3, 0.9, -1), topText: 'Individual Income Tax Rate'}).addTo(sceneGroup)
        this.corporateIncomeTaxRate = new PolicySettingsDisplay({color: policySettingsDisplayColor, position: new Points(-6, 0.9, -1), topText: 'Corporate Income Tax Rate'}).addTo(sceneGroup)
    }
    updateValues(policySettings) {
        this.interestRatePanel.updateValue(policySettings.interestRate)
        this.governmentSpendingPanel.updateValue(policySettings.governmentSpending)
        this.openMarketOperations.updateValue(policySettings.openMarketOperations)
        this.individualIncomeTaxRate.updateValue(policySettings.individualIncomeTaxRate)
        this.corporateIncomeTaxRate.updateValue(policySettings.corporateIncomeTaxRate)
    }
}
