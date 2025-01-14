import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectItem } from "@nextui-org/select";

import { TARIFFS_FEEDIN } from "../../data/tariffs-feedin.js";
import { TARIFFS_USAGE } from "../../data/tariffs-usage.js";
import { NETFEES } from "../../data/netfees.js";
import { simulateStorage } from "./simulate-storage.js";
import { format1Digit, format2Digit, formatPercent } from "../../scripts/round.js";

const CHARGING_LOSSES = [
	{ key: "5", label: "5%"},
	{ key: "10", label: "10%"},
	{ key: "15", label: "15%"},
	{ key: "20", label: "20%"},
];

const STORAGE_SIZES = [
	{ key: "7.7", label: "7,7"},
];

export default function StorageSimulatorTable ({usagePDR, feedinPDR, mdr, onSimulationResult}) {

	const [selectedNetfees, setSelectedNetfees] = useState(null);
	const [selectedFeedinTariff, setSelectedFeedinTariff] = useState(null);
	const [selectedUsageTariff, setSelectedUsageTariff] = useState(null);
	const [selectedStorageSize, setSelectedStorageSize] = useState("7.7");
	const [selectedChargingLoss, setSelectedChargingLoss] = useState("10");

	function handleStorageSizeChange (e) {
		setSelectedStorageSize(e.target.value);
	}

	function handleChargingLossChange (e) {
		setSelectedChargingLoss(e.target.value);
	}

	function handleUsageTariffChange (e) {
		setSelectedUsageTariff(e.target.value);
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

	function fillTable (usagePDR, feedinPDR, mdr) {
		if (selectedUsageTariff === null) return [];
		if (selectedFeedinTariff === null) return [];
		const usageTariff = TARIFFS_USAGE.get(selectedUsageTariff);
		const feedinTariff = TARIFFS_FEEDIN.get(selectedFeedinTariff);
		let netfees = null;

		if (selectedNetfees !== null) netfees = NETFEES[selectedNetfees];
		const lineData = simulateStorage(usagePDR, feedinPDR, mdr, selectedStorageSize, selectedChargingLoss, usageTariff, netfees, feedinTariff);

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
						onChange={handleUsageTariffChange} 
						selectedKeys={[selectedUsageTariff]} 
						size="sm" 
						variant="bordered">
							{tariffOptions(TARIFFS_USAGE).map((tariff)=> ( <SelectItem key={tariff.key}>{tariff.name}</SelectItem> ))} 
					</Select>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700 table-fixed'>
					<thead>
						<tr>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Datum
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Verbraucht (kWh)
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Eingespeist (kWh)
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Laden (kWh)
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Entladen (kWh)
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								SOC (kWh)
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								SOC (%)
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Geld gespart (ct)
							</th>
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{ fillTable(usagePDR, feedinPDR, mdr).map((lineData, idx, array) => (
							<motion.tr
								key={lineData.date}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-100'>{lineData.date}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-100'>{format2Digit(lineData.usedKwh)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-100'>{format2Digit(lineData.feedinKwh)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-100'>{format2Digit(lineData.chargedKwh)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-100'>{format2Digit(lineData.dischargedKwh)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-100'>{format1Digit(lineData.socKwh)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-100'>{formatPercent(lineData.socPercent)}</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-100'>{lineData.eurSaved}</p>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
