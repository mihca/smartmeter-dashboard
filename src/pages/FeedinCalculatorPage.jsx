import React from 'react'
import { useState } from "react";
import { Zap, CalendarFold, Sun } from 'lucide-react'
import { motion } from "framer-motion"
import { format } from "date-fns";

import Header from '../layout/Header'
import StatCard from '../components/StatCard'
import FeedinTable from '../tables/FeedinTable'

export default function UsageCalcuclatorPage({pdr, marketData}) {

    const [timeRange, setTimeRange] = useState("");
    const [bestTariff, setBestTariff] = useState({});

    function bestTariffFound (month, date, tariff) {
        setBestTariff(tariff);
        if (month == 0) {
            setTimeRange(format(pdr.utcHourFrom, "dd.MM.yyyy") + " - " + format(pdr.utcHourTo-3600000, "dd.MM.yyyy"));
        } else {
            setTimeRange(date.toLocaleString('default', { year: 'numeric', month: 'long' }));
        }
    }

	return (
		<div className='flex-1 overflow-auto realtive z-10'>
			<Header title="Einspeisevergütung" />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					{ pdr.utcHourFrom && (
						<>
							<StatCard title='Netzanbieter Einspeisung' icon={Zap} text={pdr.provider} color='#6366F1' />
							<StatCard title='Gesamter Zeitraum' icon={CalendarFold} text={format(pdr.utcHourFrom, "dd.MM.yyyy") + " - " + format(pdr.utcHourTo-3600000, "dd.MM.yyyy")} color='#8B5CF6' />
							{ bestTariff && (
								<>
									<StatCard title='Bester Tarif' icon={CalendarFold} text={bestTariff.name} color='#8B5CF6' />
									<StatCard title='Gewählter Zeitraum' icon={CalendarFold} text={timeRange} color='#8B5CF6' />
								</>
							)}
						</>
					)}
				</motion.div>

				{/* CHARTS */}
				{ pdr.hourData && (
					<>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
							<FeedinTable pdr={pdr} marketData={marketData} onBestTariffFound={bestTariffFound}/>
						</div>
					</>
				)}
			</main>
		</div>
	)
}