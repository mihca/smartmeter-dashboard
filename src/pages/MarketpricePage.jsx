import React from 'react'
import { useState } from "react";

import { motion } from "framer-motion"
import { Euro, CalendarFold, SquareArrowDown, SquareArrowUp } from 'lucide-react'
import { format } from "date-fns";

import { formatCt } from '../scripts/round';

import StatCard from '../components/StatCard'
import MarketChart from '../charts/MarketChart'
import Header from '../layout/Header'

export default function MarketpricePage ({mdr}) {

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
	const [averagePrice, setAveragePrice] = useState(0);
	const [minPriceDate, setMinPriceDate] = useState("");
	const [maxPriceDate, setMaxPriceDate] = useState("");

	function handleStatsCalculated(minPrice, minPriceDate, maxPrice, maxPriceDate, avgPrice) {
		setMinPrice(minPrice);
		setMinPriceDate(format(minPriceDate, "dd.MM.yyyy HH:mm"));
		setMaxPrice(maxPrice);
		setMaxPriceDate(format(maxPriceDate, "dd.MM.yyyy HH:mm"));
		setAveragePrice(avgPrice);
	}

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
					{ mdr.hourMap.size > 0 && (
						<>
							<StatCard title='Zeitraum' icon={CalendarFold} color='#6366F1' text={format(mdr.utcHourFrom, "dd.MM.yyyy") + " - " + format(mdr.utcHourTo-3600000, "dd.MM.yyyy")}/>
							<StatCard title='Durchschnittspreis' icon={Euro} text={formatCt(averagePrice)} color='#6366F1' />
							<StatCard title='Minimalpreis' text={formatCt(minPrice)} sub={minPriceDate} icon={SquareArrowDown} color='#6366F1' />
							<StatCard title='Maximalpreis' text={formatCt(maxPrice)} sub={maxPriceDate} icon={SquareArrowUp} color='#6366F1' />
						</>
					)}
				</motion.div>

				{/* CHARTS */}
				{ mdr.hourMap.size > 0 && (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
					<MarketChart marketHourMap={mdr.hourMap} onStatsCalculated={handleStatsCalculated}/>
				</div>
				)}
			</main>
		</div>
	)
}
