import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectItem } from "@nextui-org/select";
import { Checkbox } from "@nextui-org/checkbox";
import { format } from "date-fns";

import { formatEUR, round3Digits } from "../scripts/round.js";
import { calculateHour, calculateBasefee, calculateNetfee, addVat } from "../scripts/calculator.js";

import Bill from "../components/Bill.jsx";

import { TARIFFS } from "../data/tariffs.js";
import { NETFEES } from "../data/netfees.js";

const VAT_RATE = 20;

export default function TariffsTable ({usagePDR, marketData, onBestTariffFound}) {

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

	function monthOptions (usagePDR) {
		let months = [{key: 0, label: "Gesamt"}];
		let startDate = new Date(usagePDR.utcHourFrom);
		let endDate = new Date(usagePDR.utcHourTo);
		let date = endDate;
		
		while (date.getMonth() >= startDate.getMonth() && date.getFullYear() == startDate.getFullYear()) {
			months.push ({
				key: date.getMonth() + 1,
				label: date.toLocaleString('default', { year: 'numeric', month: 'long' })
			});
			date.setMonth(date.getMonth() - 1);
		}
		
		return months;
	}

	function title (usagePDR, monthOption) {
		if (monthOption == 0) {
			return "Kosten Gesamt";
		} else {
			let date = new Date(usagePDR.utcHourFrom)
			date.setMonth(monthOption-1);
			return date.toLocaleString('default', { year: 'numeric', month: 'long' });
		}
	}

	function highlightBestPrice (price, prices, lastLine) {
		let fontStyle = "font-light";
		if (lastLine) fontStyle = "font-bold";
		
		const min = Math.min(...prices);
		const max = Math.max(...prices);
		// const idx = Math.round ((price - min) / (max - min) * 4) + 1;
		// const fontColor = "text-yellow-" + idx + "00";
		let fontColor = "text-gray-100";
		if (price == min) fontColor = "text-yellow-300";
		if (price == max) fontColor = "text-red-400";
		const result = fontColor + " " + fontStyle;

		// console.log (price, min, max, idx, result);
		return result;
	}

	function findBestTariff (tariffs, prices) {
		const min = Math.min(...prices);
		for (let idx = 0; idx < tariffs.length; idx ++) {
			if (prices[idx] === min)
				return tariffs[idx];
		}
		return null;
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

				// Add vat and fees if wanted
				const endDate = new Date(array[idx-1].utcHour);
				let days = (monthOption == 0) ? endDate.getDate() : 1;
				let bills = [];

				tariffs.forEach((tariff, idx) => {
					let bill = [{item: "Energiepreis", value: formatEUR (lineTariffPriceSum[idx])}];
					lineTariffPriceSum[idx] += basefeeChecked ? calculateBasefee(tariff, endDate, monthOption, bill) : 0;
					lineTariffPriceSum[idx] += selectedNetfees > 0 ? calculateNetfee(NETFEES[selectedNetfees-1], days, lineSumKwh, bill) : 0;
					lineTariffPriceSum[idx] += vatChecked ? addVat(VAT_RATE, lineTariffPriceSum[idx], bill) : 0;
					bill.push ({item: "Gesamtpreis", value: formatEUR (lineTariffPriceSum[idx])});
					bills.push(bill);
				})

				lineData.push ({
					date: format(endDate, lineDatePattern),
					kwh: round3Digits(lineSumKwh),
					averageMarketPricePerKwh: round3Digits (lineMarketPriceCtSum / lineHourCounter),
					weightedMarketPricePerKwh: round3Digits (linePriceCtSumWeighted / lineSumKwh),
					tariffPricesEUR: lineTariffPriceSum,
					priceInfo: bills
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
			tariffPricesEUR: overallTariffPriceSum,
			priceInfo: []
		});

		onBestTariffFound(selectedMonth, new Date(hourData[0].utcHour), findBestTariff(tariffs, overallTariffPriceSum));

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
					<Checkbox onValueChange={e => setVatChecked(e)} isSelected={vatChecked} size="sm" >MwSt</Checkbox>
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
								Monat
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-400 tracking-wider'>
								Energie
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
										<p className={highlightBestPrice(priceEUR, pricesArray, idx === array.length-1)}>{priceEUR.toFixed(2)} EUR</p>
									</Bill>
									{ showCtPerKwh && (
										<p className='text-gray-500'>{(priceEUR/lineData.kwh*100).toFixed(1)}</p>
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
