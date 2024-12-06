import { useState } from "react";
import { motion } from "framer-motion";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { format } from "date-fns";

import { round1Digit, round3Digits } from "../scripts/round.js";
import { TARIFFS } from "../data/tariffs.js";
import { calculateHour } from "../scripts/calculator.js";
import { NETFEES } from "../data/netfees.js";

export default function TariffsTable ({usagePDR, marketData}) {

	const [selectedMonth, setSelectedMonth] = useState(0);
	const [selectedNetfees, setSelectedNetfees] = useState(0);
	const [taxChecked, setTaxChecked] = useState(false);
	const [basefeeChecked, setBasefeeChecked] = useState(false);
	
	function handleNetfeesSelected (e) {
		setSelectedNetfees(e.target.value);
	}

	function handleMonthSelected (e) {
		setSelectedMonth(e.target.value);
	};

	function netfeeOptions() {
		let options = [{label: 'Keine Netzgebühren', value: 0 }];

		NETFEES.forEach ((fee, idx) => {
			options.push ({
				label: fee.name,
				value: idx + 1
			})
		});

		return options;
	}

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

		let taxFactor = taxChecked ? 1.2 : 1.0;

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
				lineTariffPriceSum[idx] += calculateHour (tariff, hourEntry, marketData.get(hourEntry.utcHour-3600000)) / 100.0 * taxFactor;
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
				for (let t = 0; t<tariffs.length; t++) {
					overallTariffPriceSum[t] += lineTariffPriceSum[t];
				};
		
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
					<Checkbox inputId="tax" onChange={e => setTaxChecked(e.checked)} checked={taxChecked}></Checkbox>
					<label htmlFor="tax" className="ml-2">MwSt</label>
					<Checkbox inputId="basfee" onChange={e => setBasefeeChecked(e.checked)} checked={basefeeChecked}></Checkbox>
					<label htmlFor="basefee" className="ml-2">Grundgebühren</label>
					<Dropdown 
						className='bg-gray-300 text-white rounded-lg pl-10 pr-4 py-2'
						value={selectedNetfees} 
						onChange={(e) => handleNetfeesSelected(e)} 
						options={netfeeOptions()} 
						optionLabel="label"  
						optionValue="value"
						placeholder="Netzgebühren"
					/>
					<Dropdown 
						className='bg-gray-300 text-white rounded-lg pl-10 pr-4 py-2'
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
