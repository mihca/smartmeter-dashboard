import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { round1Digit } from "../scripts/round";

const salesData = [
	{ month: "Jan", sales: 4000 },
	{ month: "Feb", sales: 3000 },
	{ month: "Mar", sales: 5000 },
	{ month: "Apr", sales: 4500 },
	{ month: "May", sales: 6000 },
	{ month: "Jun", sales: 5500 },
];

export default function MarketChart ({marketData}) {

	console.log (marketData);
	console.log (Array.from(marketData, ([start, price]) => ({start, price})));

	function groupByMonth(hourData) {

		let dataByMonth = [];
		let monthSum = 0.0;
		let month = 0;

		hourData.forEach((hourEntry, idx, array) => {

			monthSum += hourEntry.kwh;

			if (new Date(hourEntry.utcHour).getMonth() != month || (idx === array.length - 1)) {
					dataByMonth.push ({
					month: month + 1,
					kwh: round1Digit(monthSum)
				});
				monthSum = 0.0;
				month += 1;
			}
		});

		return dataByMonth;
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Verbrauch pro Monat</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={Array.from(marketData, ([start, price]) => ({start, price}))}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='start' stroke='#9CA3AF' />
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
