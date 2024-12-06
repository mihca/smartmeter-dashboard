import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { Dropdown } from 'primereact/dropdown';
import { format } from "date-fns";

import { round1Digit, round3Digits } from "../scripts/round.js";
import { TARIFFS } from "../data/tariffs.js";
import { calculateHour } from "../scripts/calculator.js";

const MONTHS = [
	{ month: "Gesamt", value: 0 },
	{ month: "2024-01", value: 1 },
	{ month: "2024-02", value: 2 },
	{ month: "2024-03", value: 3 },
	{ month: "2024-04", value: 4 },
	{ month: "2024-05", value: 5 },
	{ month: "2024-06", value: 6 },
	{ month: "2024-07", value: 7 },
	{ month: "2024-08", value: 8 },
	{ month: "2024-09", value: 9 },
	{ month: "2024-10", value: 10 },
	{ month: "2024-11", value: 11 },
	{ month: "2024-12", value: 12 },
]

export default function TariffsTable ({usagePDR, marketData}) {

	const [selectedMonth, setSelectedMonth] = useState(0);

	function handleMonthSelected (e) {
		const month = e.target.value;
		setSelectedMonth(month);
	};

	function monthOptions (usagePDR) {
		let months = [{label: "Gesamt", value: 0}];
		let startDate = new Date(usagePDR.utcHourFrom);
		let endDate = new Date(usagePDR.utcHourTo);
		let date = startDate;
		
		while (date.getMonth() <= endDate.getMonth() && date.getFullYear() == endDate.getFullYear()) {
			months.push ({
				label: date.toLocaleString('default', { year: 'numeric', month: 'long' }),
				value: date.getMonth() + 1
			});
			date.setMonth(date.getMonth() + 1);
		}
		
		return months;
	}

	function title (usagePDR, month) {
		if (month === 0) {
			return "Kosten Gesamt";
		} else {
			let date = new Date(usagePDR.utcHourFrom)
			date.setMonth(month-1);
			return date.toLocaleString('default', { year: 'numeric', month: 'long' });
		}
	}

	function fillTable (tariffs, usagePDR, marketData, month) {

		let lineData = [];
		let lineHourCounter = 0;
		let lineSumKwh = 0.0;
		let lineMarketPriceCtSum = 0.0;
		let linePriceCtSumWeighted = 0.0;
		let lineTariffPriceSum = new Array(tariffs.length).fill(0.0);
	
		let overallSumKwh = 0.0;
		let overallMarketPriceSum = 0.0;
		let overallMarketPriceSumWeighted = 0.0;
		let overallTariffPriceSum = new Array(tariffs.length).fill(0.0);
	
		let hourData = usagePDR.hourData;

		// This is the default for the grouping by month
		let groupId = 0;
		let groupChange = (date, groupId) => date.getMonth() != groupId;
		let lineDatePattern = "yyyy-MM";

		// Here comes the grouping by day
		if (month > 0) {
			// Exclude 1. at 0:00, because its the sum from the last hour of the last month
			hourData = hourData.filter( (hourEntry) => 
				new Date (hourEntry.utcHour).getMonth() === (month-1) && 
				!(new Date (hourEntry.utcHour).getDate() === 1 && new Date (hourEntry.utcHour).getHours() === 0)
			);
			groupChange = (date, groupId) => date.getDate() != groupId;
			groupId = 1;
			lineDatePattern = "yyyy-MM-dd";
		}

		hourData.forEach((hourEntry, idx, array) => {
	
			lineHourCounter = lineHourCounter + 1;
			lineSumKwh += hourEntry.kwh;
			
			let marketPriceCt = marketData.get(hourEntry.utcHour-3600000);
			lineMarketPriceCtSum += marketPriceCt;
			linePriceCtSumWeighted += marketPriceCt * hourEntry.kwh;
	
			// Caluclate tariffs
			tariffs.forEach((tariff, idx) => {
				const hourPriceEUR = calculateHour (tariff, hourEntry, marketData.get(hourEntry.utcHour-3600000)) / 100.0;
				lineTariffPriceSum[idx] += hourPriceEUR;
				overallTariffPriceSum[idx] += hourPriceEUR;
			})
	
			// Change of day or month
			if (groupChange(new Date(hourEntry.utcHour), groupId) || (idx === array.length - 1)) {
				lineData.push ({
					date: format(new Date(array[idx-1].utcHour), lineDatePattern),
					kwh: round3Digits(lineSumKwh),
					averageMarketPricePerKwh: round3Digits (lineMarketPriceCtSum / lineHourCounter),
					weightedMarketPricePerKwh: round3Digits (linePriceCtSumWeighted / lineSumKwh),
					tariffPricesEUR: lineTariffPriceSum
				});
				
				overallSumKwh += lineSumKwh;
				overallMarketPriceSum += lineMarketPriceCtSum;
				overallMarketPriceSumWeighted += linePriceCtSumWeighted;
		
				lineHourCounter = 0;
				lineSumKwh = 0.0;
				lineTariffPriceSum = new Array(tariffs.length).fill(0.0);
				lineMarketPriceCtSum = 0.0;
				linePriceCtSumWeighted = 0.0;
				groupId += 1;
			}
		});
	
		lineData.push ({
			date: "Gesamt",
			kwh: overallSumKwh,
			averageMarketPricePerKwh: round3Digits (overallMarketPriceSum / hourData.length),
			weightedMarketPricePerKwh: round3Digits (overallMarketPriceSumWeighted / overallSumKwh),
			tariffPricesEUR: overallTariffPriceSum
		});

		return lineData;
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>{title(usagePDR, selectedMonth)}</h2>
				<div className='relative'>
					<Dropdown 
						className='bg-gray-300 text-white'
						value={selectedMonth} 
						onChange={(e) => handleMonthSelected(e)} 
						options={monthOptions(usagePDR)} 
						optionLabel="label"  
						optionValue="value"
						placeholder="Zeitraum"
					/>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Monat<br/>ct/kWh
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Energie<br/>ct/kWh
							</th>
							{Array.from(TARIFFS.values()).map((tariff) => (
								<th key={tariff.name} className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
									{tariff.name}
								</th>
							))}
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{ fillTable(Array.from(TARIFFS.values()), usagePDR, marketData, selectedMonth).map((lineData, idx, array) => (
							<motion.tr
								key={lineData.date}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									<p>{lineData.date}</p>
									<p className='text-gray-500'>{lineData.averageMarketPricePerKwh.toFixed(3)} ct</p>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<p className={(idx === array.length-1) ? 'font-medium text-gray-100':'text-gray-300'}>{lineData.kwh.toFixed(3)} kWh</p>
									<p className='text-gray-500'>{lineData.weightedMarketPricePerKwh.toFixed(3)} ct</p>
								</td>
								{ lineData.tariffPricesEUR.map ( (priceEUR, key) => (
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'
									key={key}>
									<p className={(idx === array.length-1) ? 'font-medium text-gray-100':'text-gray-300'}>{priceEUR.toFixed(2)} EUR</p>
									<p className='text-gray-500'>{(priceEUR/lineData.kwh*100).toFixed(3)} ct/kWh</p>
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
