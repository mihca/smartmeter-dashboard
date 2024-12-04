import React from 'react'
import { Zap, CalendarFold, Sun } from 'lucide-react'
import { motion } from "framer-motion"
import { format } from "date-fns";

import Header from '../layout/Header'
import StatCard from '../components/StatCard'
import TariffsTable from '../tables/TariffsTable'

export default function UsageCalcuclatorPage({pdr, marketData}) {

	return (
		<div className='flex-1 overflow-auto realtive z-10'>
			<Header title="Verbrauchsrechner" />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Provider Verbrauch' icon={Zap} value={pdr.provider} color='#6366F1' />
					{ !pdr.utcHourFrom && (
						<StatCard name='Zeitraum Verbrauch' icon={CalendarFold} value="-" color='#8B5CF6' />
					)}
					{ pdr.utcHourFrom && (
						<StatCard name='Zeitraum Verbrauch' icon={CalendarFold} value={format(pdr.utcHourFrom, "dd.MM.yyyy") + " - " + format(pdr.utcHourTo, "dd.MM.yyyy")} color='#8B5CF6' />
					)}
				</motion.div>

				{/* CHARTS */}
				{ pdr.hourData && (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
					<TariffsTable usagePDR={pdr} marketData={marketData}/>
				</div>
				)}
			</main>
		</div>
	)
}

