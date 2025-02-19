import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectItem } from "@heroui/select";

import { TARIFFS_FEEDIN } from "../../data/tariffs-feedin.js";
import { TARIFFS_CONSUMPTION } from "../../data/tariffs-consumption.js";
import { NETFEES } from "../../data/netfees.js";
import { simulateStorage } from "./simulate-storage.js";
import { format1Digit, format2Digit, formatPercent, formatEUR } from "../../scripts/round.js";

const CHARGING_LOSSES = [
	{ key: "0", label: "0%"},
	{ key: "5", label: "5%"},
	{ key: "10", label: "10%"},
	{ key: "15", label: "15%"},
	{ key: "20", label: "20%"},
];

const STORAGE_SIZES = [
	{ key: "5.1", label: "BYD HVS 5.1"},
	{ key: "7.7", label: "BYD HVS 7.7"},
	{ key: "11.0", label: "BYD HVM 11.0"},
	{ key: "13.8", label: "BYD HVM 13.8"},
	{ key: "22.1", label: "BYD HVM 22.1"},
];

export default function StorageSimulatorTable ({consumptionPDR, feedinPDR, mdr, onSimulationResult}) {

	const [selectedNetfees, setSelectedNetfees] = useState(null);
	const [selectedFeedinTariff, setSelectedFeedinTariff] = useState(null);
	const [selectedConsumptionTariff, setSelectedConsumptionTariff] = useState(null);
	const [selectedStorageSize, setSelectedStorageSize] = useState("7.7");
	const [selectedChargingLoss, setSelectedChargingLoss] = useState("10");

	function handleStorageSizeChange (e) {
		setSelectedStorageSize(e.target.value);
	}

	function handleChargingLossChange (e) {
		setSelectedChargingLoss(e.target.value);
	}

	function handleConsumptionTariffChange (e) {
		setSelectedConsumptionTariff(e.target.value);
	}

	function handleFeedinTariffChange (e) {
		setSelectedFeedinTariff(e.target.value);
	}

	function handleNetfeesChange (e) {
		setSelectedNetfees(e.target.value);
	}
	
	function netfeeOptions() {
		let options = NETFEES.map ((fee, idx) => ({
			key: idx + 1,
			label: fee.name
		}));
		options.unshift({ key: 0, label: 'Keine'});
		return options;
	}

	function tariffOptions(tariffs) {
		let options = Array.from(tariffs, ([key, value]) => ({ key, ...value }));
		return options.sort ((t1, t2) => t1.name.localeCompare(t2.name));
	}

	function highlight (bool) {
		if (bool)
			return "text-gray-100";
		else
			return "text-gray-400";
	}

	function fillTable (consumptionPDR, feedinPDR, mdr) {
		if (selectedConsumptionTariff === null) return [];
		if (selectedFeedinTariff === null) return [];
		const consumptionTariff = TARIFFS_CONSUMPTION.get(selectedConsumptionTariff);
		const feedinTariff = TARIFFS_FEEDIN.get(selectedFeedinTariff);
		
		let netfees = null;
		if (selectedNetfees !== null) netfees = NETFEES[selectedNetfees-1];

		const lineData = simulateStorage(consumptionPDR, feedinPDR, mdr, selectedStorageSize, selectedChargingLoss, consumptionTariff, netfees, feedinTariff);
		const overallLine = lineData[lineData.length-1];
		const days = (feedinPDR.utcHourTo - feedinPDR.utcHourFrom) / 86400000;
		const eurProfit = overallLine.eurProfit * 365 / days;
		const eurProfitYear = eurProfit;
		onSimulationResult(eurProfit, eurProfitYear, overallLine.chargedKwh/selectedStorageSize);
		return lineData;
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex w-full justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Simulation</h2>
				<div className='flex flex-wrap md:flex-nowrap gap-4 w-3/4'>
					<Select 
						className="max-w-xs" 
						label="Speichergröße" 
						onChange={handleStorageSizeChange} 
						selectedKeys={[selectedStorageSize]} 
						size="sm" 
						variant="bordered">
							{STORAGE_SIZES.map((storage)=> ( <SelectItem key={storage.key}>{storage.label}</SelectItem> ))} 
					</Select>
					<Select 
						className="max-w-xs" 
						label="Ladeverluste"
						onChange={handleChargingLossChange} 
						selectedKeys={[selectedChargingLoss]} 
						size="sm" 
						variant="bordered">
							{CHARGING_LOSSES.map((loss)=> ( <SelectItem key={loss.key}>{loss.label}</SelectItem> ))} 
						</Select>
					<Select 
						className="max-w-xs" 
						label="Netzgebühren" 
						onChange={handleNetfeesChange} 
						selectedKeys={[selectedNetfees]} 
						size="sm" 
						variant="bordered">
							{netfeeOptions().map((fee)=> ( <SelectItem key={fee.key}>{fee.label}</SelectItem> ))} 
					</Select>
					<Select 
						className="max-w-xs" 
						label="Einspeisetarif" 
						onChange={handleFeedinTariffChange} 
						selectedKeys={[selectedFeedinTariff]} 
						size="sm" 
						variant="bordered">
							{tariffOptions(TARIFFS_FEEDIN).map((tariff)=> ( <SelectItem key={tariff.key}>{tariff.name}</SelectItem> ))} 
					</Select>
					<Select 
						className="max-w-xs" 
						label="Verbrauchstarif" 
						onChange={handleConsumptionTariffChange} 
						selectedKeys={[selectedConsumptionTariff]} 
						size="sm" 
						variant="bordered">
							{tariffOptions(TARIFFS_CONSUMPTION).map((tariff)=> ( <SelectItem key={tariff.key}>{tariff.name}</SelectItem> ))} 
					</Select>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700 table-fixed text-right'>
					<thead>
						<tr>
							<th className='text-left px-2 py-2 text-xs font-medium text-gray-400 tracking-wider'>
								Datum
							</th>
							<th className='px-2 py-2 text-xs font-medium text-gray-400 tracking-wider'>
								Netzbezug<br/>(kWh)
							</th>
							<th className='px-2 py-2 text-xs font-medium text-gray-400 tracking-wider'>
								Netzbezug mit<br/>Speicher (kWh)
							</th>
							<th className='px-2 py-2 text-xs font-medium text-gray-400 tracking-wider'>
								Eingespeist<br/>(kWh)
							</th>
							<th className='px-2 py-2 text-xs font-medium text-gray-400 tracking-wider'>
								Laden<br/>(kWh)
							</th>
							<th className='px-2 py-2 text-xs font-medium text-gray-400 tracking-wider'>
								Entladen<br/>(kWh)
							</th>
							<th className='px-2 py-2 text-xs font-medium text-gray-400 tracking-wider'>
								Ø SOC<br/>(kWh)
							</th>
							<th className='px-2 py-2 text-xs font-medium text-gray-400 tracking-wider'>
								Ø SOC<br/>(%)
							</th>
							<th className='px-2 py-2 text-xs font-medium text-gray-400 tracking-wider'>
								Geld gespart<br/>(EUR)
							</th>
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{ fillTable(consumptionPDR, feedinPDR, mdr).map((lineData, idx, array) => (
							<motion.tr
								key={lineData.date}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-2 py-2 whitespace-nowrap text-sm text-left font-medium'>
									<p className='text-gray-100'>{lineData.date}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className={highlight(idx === array.length-1)}>{format1Digit(lineData.usedKwh)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className={highlight(idx === array.length-1)}>{format1Digit(lineData.usedKwhNew)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className={highlight(idx === array.length-1)}>{format1Digit(lineData.feedinKwh)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className={highlight(idx === array.length-1)}>{format1Digit(lineData.chargedKwh)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className={highlight(idx === array.length-1)}>{format1Digit(lineData.dischargedKwh)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-400'>{format1Digit(lineData.socKwh)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-400'>{formatPercent(lineData.socPercent)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className={highlight(idx === array.length-1)}>{formatEUR(lineData.eurProfit)}</p>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
