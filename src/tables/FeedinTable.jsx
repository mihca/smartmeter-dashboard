import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectItem } from "@nextui-org/select";
import { Checkbox } from "@nextui-org/checkbox";

import { calculateFeedinTable, findBestTariff } from "./calculator.js";
import { title, monthOptions, highlightBestPrice } from "./helpers.js";

import { TARIFFS_FEEDIN } from "../data/tariffs-feedin.js";
import { format1Digit, formatEUR } from "../scripts/round.js";

export default function FeedinTable ({pdr, mdr, onBestTariffFound}) {

	const [selectedMonth, setSelectedMonth] = useState("0");
	const [basefeeChecked, setBasefeeChecked] = useState(false);
	const [showCtPerKwh, setCtPerKwh] = useState(true);
	
	function handleMonthChange (e) {
		setSelectedMonth(e.target.value);
	};

	function fillTable (pdr, mdr, selectedMonth, basefeeChecked) {

		const tariffs = Array.from(TARIFFS_FEEDIN.values());
		const lineData = calculateFeedinTable (tariffs, pdr, mdr, selectedMonth, basefeeChecked);
		const overallLine = lineData[lineData.length-1];
		const bestTariff = findBestTariff(tariffs, overallLine.tariffPricesEUR, Math.max);
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
				<h2 className='text-xl font-semibold text-gray-100'>{title(pdr, selectedMonth, "Einspeisung")}</h2>
				<div className='flex flex-wrap md:flex-nowrap gap-4 w-1/2'>
					<Checkbox onValueChange={e => setBasefeeChecked(e)} isSelected={basefeeChecked} size="sm">Grundgebühren</Checkbox>
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
							{Array.from(TARIFFS_FEEDIN.values()).map((tariff) => (
								<th key={tariff.name} className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
									{tariff.name}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{ fillTable(pdr, mdr, selectedMonth, basefeeChecked).map((lineData, idx, array) => (
							<motion.tr
								key={lineData.date}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-2 py-1 whitespace-nowrap text-sm font-medium'>
									<p className='text-gray-100'>{lineData.date}</p>
									{ showCtPerKwh && (
										<p className='text-gray-500'>{lineData.averageMarketPricePerKwh.toFixed(1)}</p>
									)}
								</td>
								<td className='px-2 py-1 whitespace-nowrap text-sm font-medium'>
									<p className={(idx === array.length-1) ? 'text-gray-100':'text-gray-100'}>{lineData.kwh.toFixed(2)} kWh</p>
									{ showCtPerKwh && (
										<p className='text-gray-500'>{lineData.weightedMarketPricePerKwh.toFixed(1)}</p>
									)}
								</td>
								{ lineData.tariffPricesEUR.map ( (priceEUR, idxTariff, pricesArray) => (
								<td className='px-2 py-1 whitespace-nowrap text-sm'
									key={idxTariff}>
									<p className={highlightBestPrice(priceEUR, pricesArray, idx === array.length-1, "text-yellow-300", Math.max)}>{formatEUR(priceEUR)}</p>
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
