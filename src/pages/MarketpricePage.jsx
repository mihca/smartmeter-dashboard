import React from 'react'

import { motion } from "framer-motion"
import { Zap, CalendarFold, Sun, Euro } from 'lucide-react'
import { format } from "date-fns";

import StatCard from '../components/StatCard'
import MarketChart from '../charts/MarketChart'
import Header from '../layout/Header'

export default function MarketpricePage ({marketData}) {
  return (
    <div className='flex-1 overflow-auto realtive z-10'>
      	<Header title="Börsenstrompreis"/>
		<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
			
			{/* STATS */}
			<motion.div
				className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				{ marketData.hourMap.size > 0 && (
					<>
						<StatCard title='Zeitraum' icon={CalendarFold} value="" color='#6366F1' text={format(marketData.utcHourFrom, "dd.MM.yyyy") + " - " + format(marketData.utcHourTo-3600000, "dd.MM.yyyy")}/>
						<StatCard title='Durchschnittspreis' icon={Euro} value="" color='#6366F1' />
						<StatCard title='Minimalpreis' icon={Zap} value="" color='#6366F1' />
						<StatCard title='Maximalpreis' icon={Sun} value="" color='#6366F1' />
					</>
				)}
			</motion.div>

			{/* CHARTS */}
			{ marketData.hourMap.size > 0 && (
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
				<MarketChart marketData={marketData.hourMap}/>
			</div>
			)}
		</main>
    </div>
  )
}
