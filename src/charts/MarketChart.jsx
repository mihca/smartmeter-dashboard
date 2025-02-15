import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { round1Digit } from "../scripts/round";

export default function MarketChart ({marketHourMap, onStatsCalculated}) {

	function groupByMonth(marketHourMap) {

		let dataByMonth = [];
		let minPrice = 1000000.0;
		let minPriceDate = 0;
		let maxPrice = 0.0;
		let maxPriceDate = 0;
		let overallSum = 0.0;
		let overallCounter = 0;
		let monthSum = 0.0;
		let month = 0;
		let counter = 0;
		let prevDate = 0;
		let hourData = Array.from(marketHourMap, ([start, price]) => ({start, price}))

		hourData.forEach((hourEntry, idx, array) => {

			monthSum += hourEntry.price;
			counter += 1;
			overallCounter += 1;
			if (hourEntry.price < minPrice) {
				minPrice = hourEntry.price;
				minPriceDate = hourEntry.start;
			}
			if (hourEntry.price > maxPrice) {
				maxPrice = hourEntry.price;
				maxPriceDate = hourEntry.start;
			}

			if (new Date(hourEntry.start).getMonth() != month || (idx === array.length - 1)) {
					dataByMonth.push ({
					timestamp: prevDate.toLocaleString('default', { month: 'long' }),
					price: round1Digit(monthSum/counter)
				});
				overallSum += monthSum;
				monthSum = 0.0;
				month += 1;
				counter = 0;
			}

			prevDate = new Date(hourEntry.start);
		});

		onStatsCalculated(minPrice, minPriceDate, maxPrice, maxPriceDate, overallSum/overallCounter);

		return dataByMonth;
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Preis pro Monat</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={groupByMonth(marketHourMap)}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='timestamp' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Bar dataKey='price' fill='#F59E0B' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
