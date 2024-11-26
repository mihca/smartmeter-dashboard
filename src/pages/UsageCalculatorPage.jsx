import React from 'react'
import { Zap, CalendarFold, Sun } from 'lucide-react'
import { motion } from "framer-motion"

import Header from '../layout/Header'
import StatCard from '../components/StatCard'
import UsageChart from '../charts/UsageChart'
import TarrifsTable from '../tables/TarrifsTable'

export default function UsageCalcuclatorPage({pdr}) {

	return (
		<div className='flex-1 overflow-auto realtive z-10'>
			<Header title="Upload" />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Fix Tarif' icon={Zap} value={pdr.provider} color='#6366F1' />
					<StatCard name='Netzgebühren' icon={CalendarFold} value={pdr.dateFrom + " - " + pdr.dateTo} color='#8B5CF6' />
					<StatCard name='Provider Verbrauch' icon={Zap} value={pdr.provider} color='#6366F1' />
					<StatCard name='Zeitraum Verbrauch' icon={CalendarFold} value={pdr.dateFrom + " - " + pdr.dateTo} color='#8B5CF6' />
				</motion.div>

				{/* CHARTS */}
				{ pdr.hourData && (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
					<UsageChart hourData={pdr.hourData}/>
				</div>
				)}

				{ pdr.hourData && (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
					<TarrifsTable/>
				</div>
				)}
			</main>
		</div>
	)
}

