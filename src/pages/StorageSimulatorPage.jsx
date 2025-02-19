import React from 'react'
import { useState } from "react";

import { motion } from "framer-motion"
import { Zap, CalendarFold, Sun, Euro } from 'lucide-react'
import { format } from "date-fns";

import StatCard from '../components/StatCard'
import Header from '../layout/Header'
import StorageSimulatorTable from '../features/storage-simulator/StorageSimulatorTable'
import { format1Digit, formatEUR } from '../scripts/round'

export default function StorageSimulatorPage({consumptionPDR, feedinPDR, mdr}) {

	const [eurProfit, setEurProfit] = useState(0);
	const [eurProfit15, setEurProfit15] = useState(0);
	const [cycles, setCycles] = useState(0);
	const [timeRange, setTimeRange] = useState("");

	function handleSimulationResult (eurProfit, eurProfitYear, cycles) {
		setEurProfit(eurProfit);
		setEurProfit15(eurProfitYear*15);
		setTimeRange(format(consumptionPDR.utcHourFrom, "dd.MM.yyyy") + " - " + format(consumptionPDR.utcHourTo-3600000, "dd.MM.yyyy"));
		setCycles(cycles);
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
					{ consumptionPDR.hourData && feedinPDR.hourData && (
						<>
							<StatCard title='Ersparnis' icon={Euro} text={formatEUR(eurProfit)} color='#8B5CF6' />
							<StatCard title='Ersparnis 15 Jahre' icon={Euro} text={formatEUR(eurProfit15)} color='#6366F1' />
							<StatCard title='Volle Ladezyklen' icon={Zap} text={Math.round(cycles)} color='#6366F1' />
							<StatCard title='Zeitraum' icon={CalendarFold} text={timeRange} color='#8B5CF6' />
						</>
					)}
				</motion.div>

				{/* CHARTS */}
				{ consumptionPDR.hourData && feedinPDR.hourData && (
					<>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
							<StorageSimulatorTable consumptionPDR={consumptionPDR} feedinPDR={feedinPDR} mdr={mdr} onSimulationResult={handleSimulationResult}/>
						</div>
					</>
				)}
			</main>
		</div>
	)

}
