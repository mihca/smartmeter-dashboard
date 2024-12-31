import React from 'react'

import { motion } from "framer-motion"
import { Zap, CalendarFold, Sun, Euro } from 'lucide-react'

import StatCard from '../components/StatCard'
import Header from '../layout/Header'
import StorageSimulatorTable from '../tables/StorageSimulatorTable'

export default function StorageSimulatorPage({usagePDR, feedinPDR, mdr}) {

	function handleSimulationResult () {
	}

    return (
		<div className='flex-1 overflow-auto realtive z-10'>
			<Header title="Speicher-Simulator" />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					{ usagePDR.hourData && feedinPDR.hourData && (
						<>
							<StatCard title='Ersparnis pro Jahr' icon={Euro} text='' color='#8B5CF6' />
							<StatCard title='Kosten' icon={Euro} text='' color='#6366F1' />
							<StatCard title='Strommenge' icon={Zap} text='' color='#6366F1' />
							<StatCard title='Gewählter Zeitraum' icon={CalendarFold} text='' color='#8B5CF6' />
						</>
					)}
				</motion.div>

				{/* CHARTS */}
				{ usagePDR && feedinPDR && (
					<>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
							<StorageSimulatorTable usagePDR={usagePDR} feedinPDR={feedinPDR} mdr={mdr} onSimulationResult={handleSimulationResult}/>
						</div>
					</>
				)}
			</main>
		</div>
	)

}
