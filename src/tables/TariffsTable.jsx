import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { round1Digit, round3Digits } from "../scripts/round.js";
import { format } from "date-fns";
import { TARIFFS } from "../data/tariffs.js";
import { calculateHour } from "../scripts/calculator.js";

function tariffData (tariff, usagePDR, marketData) {

	let dataByMonth = [];
	let monthSumKwh = 0.0;
	let month = 0;
	let marketPriceSum = 0.0;
	let tariffPriceSum = 0.0;

	console.log ("Caluclate ", tariff.name);

	usagePDR.hourData.forEach((hourEntry, idx, array) => {

		monthSumKwh += hourEntry.kwh;
		marketPriceSum += marketData.get(hourEntry.utcHour) * hourEntry.kwh;
		tariffPriceSum += calculateHour (tariff, hourEntry, marketData.get(hourEntry.utcHour));

		if (new Date(hourEntry.utcHour).getMonth() != month || (idx === array.length - 1)) {
			
			dataByMonth.push ({
				yearMonth: format(new Date(array[idx-1].utcHour), "yyyy-MM"),
				kwh: round3Digits(monthSumKwh),
				averagePricePerKwh: round3Digit (marketPriceSum / monthSumKwh),
				netPriceEUR: tariffPriceSum,
				netPriceCtPerKwh: round3Digit (tariffPriceSum / monthSumKwh * 100)
			});
			
			monthSumKwh = 0.0;
			tariffPriceSum = 0.0;
			marketPriceSum = 0.0;
			month += 1;
		}
	});

	return dataByMonth;
}

export default function TariffsTable ({usagePDR, marketData}) {

	const [searchTerm, setSearchTerm] = useState("");
	// const [filteredOrders, setFilteredOrders] = useState(tariffData);

	function handleSearch (e) {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = orderData.filter(
			(order) => order.id.toLowerCase().includes(term) || order.customer.toLowerCase().includes(term)
		);
		setFilteredOrders(filtered);
	};

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
					<input
						type='text'
						placeholder='Search orders...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
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
								ct/kWh
							</th>
							{Array.from(TARIFFS.values()).map((tariff) => (
								<th key={tariff.name} className='px-6 py-3 text-left text-xs font-medium text-gray-400 tracking-wider'>
									{tariff.name}
								</th>
							))}
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{ tariffData(TARIFFS.get("smartENERGY.smartCONTROL"), usagePDR, marketData).map((monthData) => (
							<motion.tr
								key={monthData.yearMonth}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{monthData.yearMonth}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{monthData.kwh.toFixed(3)} kWh
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{monthData.averagePricePerKwh.toFixed(3)} ct
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{monthData.netPriceEUR.toFixed(2)} EUR ({monthData.netPriceCtPerKwh.toFixed(3)} ct/kWh)
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
										<Eye size={18} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
