import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

export default function UsageChart ({data}) {

	console.log (data);

	function groupByMonth(hourData) {
		let data = [];
		let monthSum = 0.0;
		let month = 0;

		if (hourData) {
			hourData.forEach((record) => {
				monthSum += record.value;
				if (record.hour.getMonth() != month) {
					data.push ({
						month: month + 1,
						kWh: monthSum
					});
					monthSum = 0.0;
					month += 1;
				}
			});
			data.push ({
				month: month + 1,
				kWh: monthSum
		});
		}

		return data;
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Verbrauch pro Monat</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={groupByMonth(data)}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Bar dataKey='kWh' fill='#F59E0B' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
