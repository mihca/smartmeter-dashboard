import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { round1Digit } from "../scripts/round";

export default function QuantityChart ({title, hourData1, hourData2, name1, color1, name2, color2}) {

	function groupByMonth(hourData1, hourData2) {

		let dataByMonth = [];
		let monthSum1 = 0.0;
		let monthSum2 = 0.0;
		let month = 0;

		hourData1.forEach((hourEntry1, idx, array) => {

			monthSum1 += hourEntry1.kwh;
			if (hourData2 && hourData2.length > idx)
				monthSum2 += hourData2[idx].kwh;

			if (new Date(hourEntry1.utcHour).getMonth() != month || (idx === array.length - 1)) {
					dataByMonth.push ({
					month: month + 1,
					kwh1: round1Digit(monthSum1),
					kwh2: round1Digit(monthSum2)
				});
				monthSum1 = 0.0;
				monthSum2 = 0.0;
				month += 1;
			}
		});

		// Fill up missing months
		for (let i = month; i < 12; i++) {
			dataByMonth.push({
				month: i + 1,
				kwh1: 0,
				kwh2: 0
			});
		}

		return dataByMonth;
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>{title}</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={groupByMonth(hourData1, hourData2)}>
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
						<Bar dataKey='kwh1' fill={color1} name={name1} />
						{ hourData2 && (
							<Bar dataKey='kwh2' fill={color2} name={name2}/>
						)}
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
