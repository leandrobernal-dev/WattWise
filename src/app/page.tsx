"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    BATTERY_TYPES,
    SOLAR_PANEL_TYPES,
    INVERTER_TYPES,
    calculateSolarRequirements,
    calculateCO2Savings,
    convertEnergy,
    type BatteryType,
    type SolarPanelType,
    type InverterType,
} from "./utils/calculations";

export default function Home() {
    const [energyValue, setEnergyValue] = useState<number>(0);
    const [energyUnit, setEnergyUnit] = useState<string>("kWh");
    const [peakSunHours, setPeakSunHours] = useState<number>(4);
    const [backupHours, setBackupHours] = useState<number>(12);
    const [systemVoltage, setSystemVoltage] = useState<number>(48);
    const [selectedBattery, setSelectedBattery] = useState<BatteryType>(
        BATTERY_TYPES[0]
    );
    const [selectedSolar, setSelectedSolar] = useState<SolarPanelType>(
        SOLAR_PANEL_TYPES[0]
    );
    const [selectedInverter, setSelectedInverter] = useState<InverterType>(
        INVERTER_TYPES[0]
    );
    const [results, setResults] = useState<any>(null);

    const handleCalculate = () => {
        const energyWh = convertEnergy(energyValue, energyUnit, "Wh");
        const result = calculateSolarRequirements(
            energyWh,
            peakSunHours,
            backupHours,
            selectedBattery,
            selectedSolar,
            selectedInverter,
            systemVoltage
        );
        setResults(result);
    };

    return (
        <div className="min-h-screen bg-[#1F2937] text-white p-6">
            <Card className="w-full max-w-4xl mx-auto bg-[#111827] border-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">
                        Solar System Calculator
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Calculate your solar and battery requirements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="flex items-center text-gray-200">
                                    Daily Energy Usage
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <InfoIcon className="w-4 h-4 ml-2 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Enter your average daily
                                                    electricity consumption
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={energyValue}
                                        onChange={(e) =>
                                            setEnergyValue(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="bg-gray-900 border-gray-700 text-white"
                                    />
                                    <Select
                                        value={energyUnit}
                                        onValueChange={setEnergyUnit}
                                    >
                                        <SelectTrigger className="w-[100px] bg-gray-900 border-gray-700 text-white">
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="Wh">
                                                Wh
                                            </SelectItem>
                                            <SelectItem value="kWh">
                                                kWh
                                            </SelectItem>
                                            <SelectItem value="MWh">
                                                MWh
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center text-gray-200">
                                    Peak Sun Hours
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <InfoIcon className="w-4 h-4 ml-2 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Average daily hours of peak
                                                    sunlight in your location
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Input
                                    type="number"
                                    value={peakSunHours}
                                    onChange={(e) =>
                                        setPeakSunHours(Number(e.target.value))
                                    }
                                    className="bg-gray-900 border-gray-700 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center text-gray-200">
                                    System Voltage
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <InfoIcon className="w-4 h-4 ml-2 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Higher voltage means lower
                                                    current and smaller wire
                                                    size requirements
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Select
                                    value={String(systemVoltage)}
                                    onValueChange={(v) =>
                                        setSystemVoltage(Number(v))
                                    }
                                >
                                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                        <SelectValue placeholder="Select voltage" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-700">
                                        <SelectItem value="12">12V</SelectItem>
                                        <SelectItem value="24">24V</SelectItem>
                                        <SelectItem value="48">48V</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center text-gray-200">
                                    Backup Hours
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <InfoIcon className="w-4 h-4 ml-2 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    How many hours you want
                                                    battery backup to last
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Input
                                    type="number"
                                    value={backupHours}
                                    onChange={(e) =>
                                        setBackupHours(Number(e.target.value))
                                    }
                                    className="bg-gray-900 border-gray-700 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="flex items-center text-gray-200">
                                    Battery Type
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <InfoIcon className="w-4 h-4 ml-2 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    {
                                                        selectedBattery.description
                                                    }
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Select
                                    value={selectedBattery.name}
                                    onValueChange={(name) =>
                                        setSelectedBattery(
                                            BATTERY_TYPES.find(
                                                (b) => b.name === name
                                            )!
                                        )
                                    }
                                >
                                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                        <SelectValue placeholder="Select battery type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-700">
                                        {BATTERY_TYPES.map((battery) => (
                                            <SelectItem
                                                key={battery.name}
                                                value={battery.name}
                                            >
                                                {battery.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center text-gray-200">
                                    Solar Panel Type
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <InfoIcon className="w-4 h-4 ml-2 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    {selectedSolar.description}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Select
                                    value={selectedSolar.name}
                                    onValueChange={(name) =>
                                        setSelectedSolar(
                                            SOLAR_PANEL_TYPES.find(
                                                (s) => s.name === name
                                            )!
                                        )
                                    }
                                >
                                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                        <SelectValue placeholder="Select solar panel type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-700">
                                        {SOLAR_PANEL_TYPES.map((solar) => (
                                            <SelectItem
                                                key={solar.name}
                                                value={solar.name}
                                            >
                                                {solar.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center text-gray-200">
                                    Inverter Type
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <InfoIcon className="w-4 h-4 ml-2 text-gray-400" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    {
                                                        selectedInverter.description
                                                    }
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                                <Select
                                    value={selectedInverter.name}
                                    onValueChange={(name) =>
                                        setSelectedInverter(
                                            INVERTER_TYPES.find(
                                                (i) => i.name === name
                                            )!
                                        )
                                    }
                                >
                                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                        <SelectValue placeholder="Select inverter type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-700">
                                        {INVERTER_TYPES.map((inverter) => (
                                            <SelectItem
                                                key={inverter.name}
                                                value={inverter.name}
                                            >
                                                {inverter.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                className="w-full bg-[#2DD4BF] hover:bg-[#14B8A6] text-gray-900 font-medium"
                            >
                                Calculate System
                            </Button>
                        </div>
                    </div>

                    {results && (
                        <div className="mt-8 space-y-6 bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <h3 className="text-xl font-semibold text-[#60A5FA]">
                                System Requirements
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-gray-400">
                                            Solar Array
                                        </h4>
                                        <p className="text-2xl font-bold text-white">
                                            {results.solarPanelWattage}W
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            System Efficiency:{" "}
                                            {results.systemEfficiency.toFixed(
                                                1
                                            )}
                                            %
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-gray-400">
                                            Battery System
                                        </h4>
                                        <p className="text-2xl font-bold text-white">
                                            {results.batterySpecs.ampHours.toFixed(
                                                1
                                            )}
                                            Ah at{" "}
                                            {
                                                results.batterySpecs
                                                    .recommendedVoltage
                                            }
                                            V
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Capacity:{" "}
                                            {(
                                                results.batterySpecs
                                                    .actualCapacity / 1000
                                            ).toFixed(1)}
                                            kWh
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Expected Cycles:{" "}
                                            {
                                                results.batterySpecs
                                                    .estimatedLifespan
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-gray-400">
                                            Inverter Size
                                        </h4>
                                        <p className="text-2xl font-bold text-white">
                                            {results.inverterSize}W
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-gray-400">
                                            Estimated Costs
                                        </h4>
                                        <p className="text-2xl font-bold text-[#60A5FA]">
                                            ${results.totalCost.toFixed(2)}
                                        </p>
                                        <div className="text-sm text-gray-400 space-y-1">
                                            <p>
                                                Solar Panels: $
                                                {results.costs.solar.toFixed(2)}
                                            </p>
                                            <p>
                                                Battery System: $
                                                {results.costs.battery.toFixed(
                                                    2
                                                )}
                                            </p>
                                            <p>
                                                Inverter: $
                                                {results.costs.inverter.toFixed(
                                                    2
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-gray-400">
                                            Annual CO2 Savings
                                        </h4>
                                        <p className="text-2xl font-bold text-white">
                                            {calculateCO2Savings(
                                                convertEnergy(
                                                    energyValue,
                                                    energyUnit,
                                                    "kWh"
                                                ) * 365
                                            )}
                                            kg
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
