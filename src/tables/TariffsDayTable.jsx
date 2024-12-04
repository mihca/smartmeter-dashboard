import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { Dropdown } from 'primereact/dropdown';
import { format } from "date-fns";

import { round1Digit, round3Digits } from "../scripts/round.js";
import { TARIFFS } from "../data/tariffs.js";
import { calculateHourEUR } from "../scripts/calculator.js";

export default function TariffsDayTable ({usagePDR, marketData}) {

	function tariffData (tariffs, usagePDR, marketData) {

		let dataByDay = [];
		let day = 1;
		let dayHourCounter = 0;
		let daySumKwh = 0.0;
		let marketPriceSum = 0.0;
		let marketPriceSumWeighted = 0.0;
		let tariffPriceSum = new Array(tariffs.length).fill(0.0);
	
		let overallSumKwh = 0.0;
		let overallMarketPriceSum = 0.0;
		let overallMarketPriceSumWeighted = 0.0;
		let overallTariffPriceSum = new Array(tariffs.length).fill(0.0);
	
		console.log (usagePDR.hourData);

		const hourDataForMonth = usagePDR.hourData.filter( (hourEntry) => 
			new Date (hourEntry.utcHour).getMonth() === 11 && 
			!(new Date (hourEntry.utcHour).getDate() === 1 && new Date (hourEntry.utcHour).getHours() === 0)
		);

		console.log (hourDataForMonth);

		hourDataForMonth.forEach((hourEntry, idx, array) => {
	
			console.log (new Date(hourEntry.utcHour), hourEntry.kwh);

			dayHourCounter = dayHourCounter + 1;
			daySumKwh += hourEntry.kwh;
			
			let marketPrice = marketData.get(hourEntry.utcHour-3600000);
			marketPriceSum += marketPrice;
			marketPriceSumWeighted += marketPrice * hourEntry.kwh;
	
			tariffs.forEach((tariff, idx, array) => {
				const hourPrice = calculateHourEUR (tariff, hourEntry, marketData.get(hourEntry.utcHour-3600000));
				tariffPriceSum[idx] += hourPrice;
				overallTariffPriceSum[idx] += hourPrice;
			})
	
			// Change of day
			if (new Date(hourEntry.utcHour).getDate() != day || (idx === array.length - 1)) {
				dataByDay.push ({
					date: format(new Date(array[idx-1].utcHour), "yyyy-MM-dd"),
					kwh: round3Digits(daySumKwh),
					averageMarketPricePerKwh: round3Digits (marketPriceSum / dayHourCounter),
					weightedMarketPricePerKwh: round3Digits (marketPriceSumWeighted / daySumKwh),
					tariffPrices: tariffPriceSum
				});
				
				console.log (format(new Date(array[idx-1].utcHour), "yyyy-MM-dd"), round3Digits(daySumKwh));

				overallSumKwh += daySumKwh;
				overallMarketPriceSum += marketPriceSum;
				overallMarketPriceSumWeighted += marketPriceSumWeighted;
		
				dayHourCounter = 0;
				daySumKwh = 0.0;
				tariffPriceSum = new Array(tariffs.length).fill(0.0);
				marketPriceSum = 0.0;
				marketPriceSumWeighted = 0.0;
				day += 1;
			}
		});
	
		dataByDay.push ({
			date: "Gesamt",
			kwh: overallSumKwh,
			averageMarketPricePerKwh: round3Digits (overallMarketPriceSum / usagePDR.hourData.length),
			weightedMarketPricePerKwh: round3Digits (overallMarketPriceSumWeighted / overallSumKwh),
			tariffPrices: overallTariffPriceSum
		});

		return dataByDay;
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Kosten 2024-12</h2>
				<div className='relative'>
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
						{ tariffData(Array.from(TARIFFS.values()), usagePDR, marketData).map((dayData) => (
							<motion.tr
								key={dayData.date}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{dayData.date}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{dayData.kwh.toFixed(3)} kWh
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{dayData.averageMarketPricePerKwh.toFixed(3)} ct
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{dayData.weightedMarketPricePerKwh.toFixed(3)} ct
								</td>
								{ dayData.tariffPrices.map ( (tariffPrice, idx) => (
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'
									key={idx}>
									{tariffPrice.toFixed(2)} EUR <br/> 
									{(tariffPrice/dayData.kwh*100).toFixed(3)} ct/kWh
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
