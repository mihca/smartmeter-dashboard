import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectItem } from "@nextui-org/select";
import { Checkbox } from "@nextui-org/checkbox";

import { calculateTariffsTable, findBestTariff } from "./calculator.js";
import { formatEUR, format1Digit } from "../scripts/round.js";
import { monthOptions, title, highlightBestPrice } from "./helpers.js";

import Bill from "../components/Bill.jsx";

import { TARIFFS_USAGE } from "../data/tariffs-usage.js";
import { NETFEES } from "../data/netfees.js";

export default function TariffsTable ({pdr, mdr, onBestTariffFound}) {

	const [selectedMonth, setSelectedMonth] = useState("0");
	const [selectedNetfees, setSelectedNetfees] = useState("0");
	const [vatChecked, setVatChecked] = useState(true);
	const [basefeeChecked, setBasefeeChecked] = useState(true);
	const [showCtPerKwh, setCtPerKwh] = useState(true);
	
	function handleNetfeesChange (e) {
		setSelectedNetfees(e.target.value);
	}

	function handleMonthChange (e) {
		setSelectedMonth(e.target.value);
	};

	function netfeeOptions() {
		let options = NETFEES.map ((fee, idx) => ({
			key: idx + 1,
			label: fee.name
		}));
		options.unshift({ key: 0, label: 'Keine'});
		return options;
	}

	function fillTable (pdr, mdr, selectedMonth) {
		const tariffs = Array.from(TARIFFS_USAGE.values());
		const lineData = calculateTariffsTable (tariffs, pdr, mdr, selectedMonth, basefeeChecked, vatChecked, selectedNetfees);
		const overallLine = lineData[lineData.length-1];
		const bestTariff = findBestTariff(tariffs, overallLine.tariffPricesEUR, Math.min);
		onBestTariffFound(selectedMonth, new Date(pdr.hourData[0].utcHour), overallLine.kwh, bestTariff.tariff, bestTariff.price);
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
				<h2 className='text-xl font-semibold text-gray-100'>{title(pdr, selectedMonth, "Kosten")}</h2>
				<div className='flex flex-wrap md:flex-nowrap gap-4 w-1/2'>
					<Checkbox onValueChange={e => setVatChecked(e)} isSelected={vatChecked} size="sm" >MwSt</Checkbox>
					<Checkbox onValueChange={e => setBasefeeChecked(e)} isSelected={basefeeChecked} size="sm">Grundgebühren</Checkbox>
					<Select 
						className="max-w-xs bg-gray-800" 
						label="Netzgebühren" 
						onChange={handleNetfeesChange} 
						selectedKeys={[selectedNetfees]} 
						size="sm" 
						variant="bordered">
							{netfeeOptions().map((fee)=> ( <SelectItem key={fee.key}>{fee.label}</SelectItem> ))} 
					</Select>

					<Select 
						className="max-w-xs" 
						label="Zeitraum" 
						onChange={handleMonthChange} 
						selectedKeys={[selectedMonth]} 
						size="sm" 
						variant="bordered">
							{monthOptions(pdr).map((month)=> ( <SelectItem key={month.key}>{month.label}</SelectItem> ))} 
					</Select>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='table-fixed divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Monat
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Energie
							</th>
							{Array.from(TARIFFS_USAGE.values()).map((tariff) => (
								<th key={tariff.name} className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
									{tariff.name}
								</th>
							))}
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{ fillTable(pdr, mdr, selectedMonth).map((lineData, idx, array) => (
							<motion.tr
								key={lineData.date}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-100'>{lineData.date}</p>
									{ showCtPerKwh && (
										<p className='text-gray-500'>{lineData.averageMarketPricePerKwh.toFixed(1)}</p>
									)}
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
									<p className={(idx === array.length-1) ? 'text-gray-100':'text-gray-100'}>{lineData.kwh.toFixed(2)} kWh</p>
									{ showCtPerKwh && (
										<p className='text-gray-500'>{lineData.weightedMarketPricePerKwh.toFixed(1)}</p>
									)}
								</td>
								{ lineData.tariffPricesEUR.map ( (priceEUR, idxTariff, pricesArray) => (
								<td className='px-2 py-2 whitespace-nowrap text-sm'
									key={idxTariff}>
									<Bill bill={lineData.priceInfo[idxTariff]}>
										<p className={highlightBestPrice(priceEUR, pricesArray, idx === array.length-1, "text-yellow-300", "text-red-400")}>{formatEUR(priceEUR)}</p>
									</Bill>
									{ showCtPerKwh && (
										<p className='text-gray-500'>{format1Digit(priceEUR/lineData.kwh*100)}</p>
									)}
								</td>
								))}
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
