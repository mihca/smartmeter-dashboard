import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { Dropdown } from 'primereact/dropdown';
import { format } from "date-fns";

import { round1Digit, round3Digits } from "../scripts/round.js";
import { TARIFFS } from "../data/tariffs.js";
import { calculateHourEUR } from "../scripts/calculator.js";

const MONTHS = [
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

	const [selectedMonth, setSelectedMonth] = useState("Gesamt");
	const [months, setMonths] = useState(MONTHS);

	function handleMonthSelected (e) {
		const month = e.target.value;
		setSelectedMonth(month);
	};

	function tariffData (tariffs, usagePDR, marketData) {

		let dataByMonth = [];
		let month = 0;
		let monthHourCounter = 0;
		let monthSumKwh = 0.0;
		let marketPriceSum = 0.0;
		let marketPriceSumWeighted = 0.0;
		let tariffPriceSum = new Array(tariffs.length).fill(0.0);
	
		let overallSumKwh = 0.0;
		let overallMarketPriceSum = 0.0;
		let overallMarketPriceSumWeighted = 0.0;
		let overallTariffPriceSum = new Array(tariffs.length).fill(0.0);
	
		usagePDR.hourData.forEach((hourEntry, idx, array) => {
	
			let months = [];
	
			monthHourCounter = monthHourCounter + 1;
			monthSumKwh += hourEntry.kwh;
			
			let marketPrice = marketData.get(hourEntry.utcHour-3600000);
			marketPriceSum += marketPrice;
			marketPriceSumWeighted += marketPrice * hourEntry.kwh;
	
			tariffs.forEach((tariff, idx, array) => {
				const hourPrice = calculateHourEUR (tariff, hourEntry, marketData.get(hourEntry.utcHour-3600000));
				tariffPriceSum[idx] += hourPrice;
				overallTariffPriceSum[idx] += hourPrice;
			})
	
			// Change of month: We are calculating in local time with new Date()
			if (new Date(hourEntry.utcHour).getMonth() != month || (idx === array.length - 1)) {
	
				dataByMonth.push ({
					yearMonth: format(new Date(array[idx-1].utcHour), "yyyy-MM"),
					kwh: round3Digits(monthSumKwh),
					averageMarketPricePerKwh: round3Digits (marketPriceSum / monthHourCounter),
					weightedMarketPricePerKwh: round3Digits (marketPriceSumWeighted / monthSumKwh),
					tariffPrices: tariffPriceSum
				});
				
				overallSumKwh += monthSumKwh;
				overallMarketPriceSum += marketPriceSum;
				overallMarketPriceSumWeighted += marketPriceSumWeighted;
		
				monthHourCounter = 0;
				monthSumKwh = 0.0;
				tariffPriceSum = new Array(tariffs.length).fill(0.0);
				marketPriceSum = 0.0;
				marketPriceSumWeighted = 0.0;
				month += 1;
	
				months.push ({
					month: format(new Date(array[idx-1].utcHour), "yyyy-MM")
				});
			}
		});
	
		dataByMonth.push ({
			yearMonth: "Gesamt",
			kwh: overallSumKwh,
			averageMarketPricePerKwh: round3Digits (overallMarketPriceSum / usagePDR.hourData.length),
			weightedMarketPricePerKwh: round3Digits (overallMarketPriceSumWeighted / overallSumKwh),
			tariffPrices: overallTariffPriceSum
		});

		// setMonths(months);

		return dataByMonth;
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Kosten monatlich</h2>
				<div className='relative'>
					<Dropdown 
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-5 pr-1'
						value={selectedMonth} 
						onChange={(e) => handleMonthSelected(e)} 
						options={months} 
						optionLabel="month"  
						placeholder="Zeitraum"
					/>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Monat
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Energie
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								ct/kWh netto<br/>Durchschnitt
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
								ct/kWh netto<br/>nach Verbrauch
							</th>
							{Array.from(TARIFFS.values()).map((tariff) => (
								<th key={tariff.name} className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
									{tariff.name}
								</th>
							))}
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{ tariffData(Array.from(TARIFFS.values()), usagePDR, marketData).map((monthData) => (
							<motion.tr
								key={monthData.yearMonth}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{monthData.yearMonth}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{monthData.kwh.toFixed(3)} kWh
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{monthData.averageMarketPricePerKwh.toFixed(3)} ct
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{monthData.weightedMarketPricePerKwh.toFixed(3)} ct
								</td>
								{ monthData.tariffPrices.map ( (tariffPrice, idx) => (
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'
									key={idx}>
									{tariffPrice.toFixed(2)} EUR <br/> 
									{(tariffPrice/monthData.kwh*100).toFixed(3)} ct/kWh <br/> 
									{(tariffPrice/monthData.kwh*100*1.2).toFixed(3)} ct/kWh
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
