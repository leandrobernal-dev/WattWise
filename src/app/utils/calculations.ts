export type BatteryType = {
    name: string
    efficiency: number
    depthOfDischarge: number
    lifeCycles: number
    costPerKwh: number
    description: string
}

export type SolarPanelType = {
    name: string
    efficiency: number
    costPerWatt: number
    description: string
}

export type InverterType = {
    name: string
    efficiency: number
    costPerWatt: number
    description: string
}

export const BATTERY_TYPES: BatteryType[] = [
    {
        name: "Lithium Ion",
        efficiency: 0.95,
        depthOfDischarge: 0.8,
        lifeCycles: 5000,
        costPerKwh: 500,
        description: "High efficiency, long life cycles, deep discharge capability. Best for most home installations."
    },
    {
        name: "Lead Acid (AGM)",
        efficiency: 0.85,
        depthOfDischarge: 0.5,
        lifeCycles: 1500,
        costPerKwh: 200,
        description: "Lower cost, but shorter lifespan and lower depth of discharge. Good for budget installations."
    },
    {
        name: "LiFePO4",
        efficiency: 0.98,
        depthOfDischarge: 0.9,
        lifeCycles: 7000,
        costPerKwh: 800,
        description: "Highest efficiency and longest lifespan. Safest chemistry but more expensive."
    }
]

export const SOLAR_PANEL_TYPES: SolarPanelType[] = [
    {
        name: "Monocrystalline",
        efficiency: 0.22,
        costPerWatt: 1.5,
        description: "Highest efficiency, best for limited space. Premium choice for residential installations."
    },
    {
        name: "Polycrystalline",
        efficiency: 0.17,
        costPerWatt: 1,
        description: "Good balance of cost and efficiency. Suitable for most home installations."
    },
    {
        name: "Thin Film",
        efficiency: 0.11,
        costPerWatt: 0.7,
        description: "Lowest cost but requires more space. Good for large, unshaded areas."
    }
]

export const INVERTER_TYPES: InverterType[] = [
    {
        name: "String Inverter",
        efficiency: 0.96,
        costPerWatt: 0.4,
        description: "Most common type. Good for simple installations with minimal shading."
    },
    {
        name: "Microinverter",
        efficiency: 0.95,
        costPerWatt: 0.6,
        description: "Best for complex roofs or partial shading. Allows per-panel optimization."
    },
    {
        name: "Hybrid Inverter",
        efficiency: 0.94,
        costPerWatt: 0.7,
        description: "Combines solar and battery inverter. Best for systems with battery storage."
    }
]

export const convertEnergy = (value: number, fromUnit: string, toUnit: string): number => {
    const toWh: { [key: string]: number } = {
        'Wh': 1,
        'kWh': 1000,
        'MWh': 1000000
    }

    const wh = value * toWh[fromUnit]
    return wh / toWh[toUnit]
}

export const calculateBatterySpecs = (
    energyWh: number,
    batteryType: BatteryType,
    systemVoltage: number
) => {
    const actualCapacity = energyWh / batteryType.depthOfDischarge
    const ampHours = actualCapacity / systemVoltage
    return {
        actualCapacity,
        ampHours,
        recommendedVoltage: systemVoltage,
        estimatedLifespan: batteryType.lifeCycles,
        cost: (actualCapacity / 1000) * batteryType.costPerKwh
    }
}

export const calculateSolarRequirements = (
    dailyUsageWh: number,
    peakSunHours: number,
    backupHours: number,
    batteryType: BatteryType,
    solarType: SolarPanelType,
    inverterType: InverterType,
    systemVoltage: number
) => {
    const systemEfficiency = solarType.efficiency * inverterType.efficiency * 0.9 // Additional 10% loss for wiring/dust
    const requiredDailyEnergy = dailyUsageWh / systemEfficiency
    const solarPanelWattage = Math.ceil((requiredDailyEnergy) / peakSunHours)

    const batterySpecs = calculateBatterySpecs(
        backupHours * dailyUsageWh,
        batteryType,
        systemVoltage
    )

    const inverterSize = Math.ceil(solarPanelWattage * 1.2) // 20% overhead for surge capacity

    const costs = {
        solar: solarPanelWattage * solarType.costPerWatt,
        battery: batterySpecs.cost,
        inverter: inverterSize * inverterType.costPerWatt
    }

    return {
        solarPanelWattage,
        batterySpecs,
        inverterSize,
        costs,
        totalCost: costs.solar + costs.battery + costs.inverter,
        systemEfficiency: systemEfficiency * 100
    }
}

export const calculateCO2Savings = (annualKwh: number) => {
    const co2PerKwh = 0.4 // kg CO2 per kWh (average grid mix)
    return Math.ceil(annualKwh * co2PerKwh)
}

