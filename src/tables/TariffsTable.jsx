import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectItem } from "@nextui-org/select";
import { Checkbox } from "@nextui-org/checkbox";
import { Tooltip } from "@nextui-org/react";
import { format } from "date-fns";

import { round3Digits } from "../scripts/round.js";
import { TARIFFS } from "../data/tariffs.js";
import { calculateHour, calculateBasefee, calculateNetfee, addTax } from "../scripts/calculator.js";
import { NETFEES } from "../data/netfees.js";

export default function TariffsTable ({usagePDR, marketData}) {

	const [selectedMonth, setSelectedMonth] = useState("0");
	const [selectedNetfees, setSelectedNetfees] = useState("0");
	const [taxChecked, setTaxChecked] = useState(false);
	const [basefeeChecked, setBasefeeChecked] = useState(false);
	
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

	function monthOptions (usagePDR) {
		let months = [{key: 0, label: "Gesamt"}];
		let startDate = new Date(usagePDR.utcHourFrom);
		let endDate = new Date(usagePDR.utcHourTo);
		let date = startDate;
		
		while (date.getMonth() <= endDate.getMonth() && date.getFullYear() == endDate.getFullYear()) {
			months.push ({
				key: date.getMonth() + 1,
				label: date.toLocaleString('default', { year: 'numeric', month: 'long' })
			});
			date.setMonth(date.getMonth() + 1);
		}
		
		return months;
	}

	function title (usagePDR, monthOption) {
		console.log(monthOption);
		if (monthOption == 0) {
			return "Kosten Gesamt";
		} else {
			let date = new Date(usagePDR.utcHourFrom)
			date.setMonth(monthOption-1);
			return date.toLocaleString('default', { year: 'numeric', month: 'long' });
		}
	}

	function fillTable (tariffs, usagePDR, marketData, monthOption) {

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
		if (monthOption > 0) {
			// Exclude 1. at 0:00, because its the sum from the last hour of the last month
			hourData = hourData.filter( (hourEntry) => 
				new Date (hourEntry.utcHour).getMonth() === (monthOption-1) && 
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
	
			// Calculate tariffs
			tariffs.forEach((tariff, idx) => {
				lineTariffPriceSum[idx] += calculateHour (tariff, hourEntry, marketData.get(hourEntry.utcHour-3600000));
			})
	
			// Change of day or month
			if (groupChange(new Date(hourEntry.utcHour), groupId) || (idx === array.length - 1)) {

				// Add tax and fees if wanted
				const endDate = new Date(array[idx-1].utcHour);
				let days = (monthOption === 0) ? endDate.getDate() : 1;

				tariffs.forEach((tariff, idx) => {
					lineTariffPriceSum[idx] += basefeeChecked ? calculateBasefee(tariff, endDate, monthOption) : 0;
					lineTariffPriceSum[idx] += selectedNetfees > 0 ? calculateNetfee(NETFEES[selectedNetfees-1], days, lineSumKwh) : 0;
					// Add tax in last step!
					lineTariffPriceSum[idx] += taxChecked ? addTax(lineTariffPriceSum[idx]) : 0;
				})

				lineData.push ({
					date: format(endDate, lineDatePattern),
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
			<div className='flex w-full justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>{title(usagePDR, selectedMonth)}</h2>
				<div className='flex flex-wrap md:flex-nowrap gap-4 w-1/2'>
					<Checkbox onValueChange={e => setTaxChecked(e)} isSelected={taxChecked} size="sm" >MwSt</Checkbox>
					<Checkbox onValueChange={e => setBasefeeChecked(e)} isSelected={basefeeChecked} size="sm">Grundgebühren</Checkbox>
					<Select 
						className="max-w-xs bg-gray-800" 
						label="Netzgebühren" 
						onChange={handleNetfeesChange} 
						selectedKeys={[selectedNetfees]} 
						size="sm" 
						variant="bordered">
							{netfeeOptions(usagePDR).map((fee)=> ( <SelectItem key={fee.key}>{fee.label}</SelectItem> ))} 
					</Select>

					<Select 
						className="max-w-xs" 
						label="Zeitraum" 
						onChange={handleMonthChange} 
						selectedKeys={[selectedMonth]} 
						size="sm" 
						variant="bordered">
							{monthOptions(usagePDR).map((month)=> ( <SelectItem key={month.key}>{month.label}</SelectItem> ))} 
					</Select>
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Monat<br/>ct/kWh
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Energie<br/>ct/kWh
							</th>
							{Array.from(TARIFFS.values()).map((tariff) => (
								<th key={tariff.name} className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
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
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-100'>
									<p>{lineData.date}</p>
									<p className='text-gray-500'>{lineData.averageMarketPricePerKwh.toFixed(3)} ct</p>
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm text-gray-300'>
									<p className={(idx === array.length-1) ? 'font-medium text-gray-100':'text-gray-300'}>{lineData.kwh.toFixed(3)} kWh</p>
									<p className='text-gray-500'>{lineData.weightedMarketPricePerKwh.toFixed(3)} ct</p>
								</td>
								{ lineData.tariffPricesEUR.map ( (priceEUR, key) => (
								<td className='px-2 py-2 whitespace-nowrap text-sm text-gray-300'
									key={key}>
									<Tooltip content="I am a tooltip" radius="sm" size="sm">
										<p className={(idx === array.length-1) ? 'font-medium text-gray-100':'text-gray-300'}>{priceEUR.toFixed(2)} EUR</p>
									</Tooltip>
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
