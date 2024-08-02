import * as THREE from 'three'
import MetricsDisplay from './MetricsDisplay.js'
import GameDateDisplay from './GameDateDisplay.js'
import FillerPanel  from './FillerPanel.js'
import { Points } from '../lib/utils.js'

// metrics displays
export default class MetricsDisplays extends THREE.Group {
    constructor() {
        super()
        this.aggregateDemandPanel = new MetricsDisplay({color: 'green', position: new Points(6.6, 0.5, -1.55), topText: 'Aggregate Demand'}).addTo(this)
        this.populationPanel = new MetricsDisplay({color: 'red', position: new Points(6.6, 1.6, -1.55), topText: 'Population', bottomText: '3'}).addTo(this)
        this.governmentDebtPanel = new MetricsDisplay({color: 'blue', position: new Points(6.6, 2.7, -1.55), topText: 'Government Debt', bottomText: '3'}).addTo(this)
        this.moneySupplyPanel = new MetricsDisplay({color: 'yellow', position: new Points(6.6, 3.8, -1.55), topText: 'Money Supply', bottomText: '3'}).addTo(this)
        this.unemploymentRatePanel = new MetricsDisplay({color: 'gold', position: new Points(6.6, 4.9, -1.55), topText: 'Unemployment Rate', bottomText: '3'}).addTo(this)
        this.inflationPanel = new MetricsDisplay({color: 'magenta', position: new Points(-6.6, 4.9, -1.55), topText: 'Inflation', bottomText: '3'}).addTo(this)
        this.governmentIncomePanel = new MetricsDisplay({color: 'cyan', position: new Points(-6.6, 3.8, -1.55), topText: 'Government Income', bottomText: '3'}).addTo(this)
        this.netExportPanel = new MetricsDisplay({color: 'white', position: new Points(-6.6, 2.7, -1.55), topText: 'Net Export', bottomText: '3'}).addTo(this)
        this.investmentPanel = new MetricsDisplay({color: 'purple', position: new Points(-6.6, 1.6, -1.55), topText: 'Investment', bottomText: '3'}).addTo(this)
        this.consumptionPanel = new MetricsDisplay({color: 'orange', position: new Points(-6.6, 0.5, -1.55), topText: 'Consumption', bottomText: '3'}).addTo(this)
        this.datePanel = new GameDateDisplay().addTo(this)
        // fillers
        // const fillerCentres = [0.05, 1.05, 2.15, 3.25, 4.35]
        const fillerCentres = [1.05, 2.15, 3.25, 4.35]
        for (const f of fillerCentres) {
            new FillerPanel(new Points(3, 0.1, 0.6), new Points(-6.6, f, -1.5)).addTo(this)
            new FillerPanel(new Points(3, 0.1, 0.6), new Points(6.6, f, -1.5)).addTo(this)
        }
        new FillerPanel(new Points(0.1, 5.4, 0.6), new Points(-8.15, 2.7, -1.5)).addTo(this)
        new FillerPanel(new Points(0.1, 1.0, 0.6), new Points(-1.55, 5.94, -1.5)).addTo(this)
        new FillerPanel(new Points(0.1, 5.4, 0.6), new Points(8.15, 2.7, -1.5)).addTo(this)
        new FillerPanel(new Points(0.1, 1, 0.6), new Points(1.55, 5.94, -1.5)).addTo(this)
        new FillerPanel(new Points(3.2, 0.1, 0.6), new Points(0.0, 6.46, -1.5)).addTo(this)
        new FillerPanel(new Points(6.7, 0.1, 0.6), new Points(4.85, 5.45, -1.5)).addTo(this)
        new FillerPanel(new Points(6.7, 0.1, 0.6), new Points(-4.85, 5.45, -1.5)).addTo(this)
    }
}

// export default metricsDisplayGroup