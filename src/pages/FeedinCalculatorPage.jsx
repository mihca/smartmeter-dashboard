import React from 'react'
import { useState } from "react";
import { Medal, CalendarFold, Euro, Sun } from 'lucide-react'
import { motion } from "framer-motion"
import { format } from "date-fns";

import { formatEUR, round1Digit } from '../scripts/round';

import Header from '../layout/Header'
import StatCard from '../components/StatCard'
import FeedinTable from '../tables/FeedinTable'

export default function UsageCalcuclatorPage({pdr, mdr}) {

    const [timeRange, setTimeRange] = useState("");
    const [bestTariff, setBestTariff] = useState(null);
    const [bestPrice, setBestPrice] = useState(0);
	const [quantity, setQuantity] = useState(0);

    function bestTariffFound (month, date, kwh, tariff, price) {
        setBestTariff(tariff);
		setBestPrice(price);
		setQuantity(kwh);
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
					{ bestTariff && (
						<>
							<StatCard title='Bester Tarif' icon={Medal} text={bestTariff.name} sub={bestTariff.company} color='#8B5CF6' />
							<StatCard title='Vergütung' icon={Euro} text={formatEUR(bestPrice)} color='#6366F1' />
							<StatCard title='Strommenge' icon={Sun} text={round1Digit(quantity) + " kWh"} color='#6366F1' />
							<StatCard title='Gewählter Zeitraum' icon={CalendarFold} text={timeRange} color='#8B5CF6' />
						</>
					)}
				</motion.div>

				{/* CHARTS */}
				{ pdr.hourData && (
					<>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
							<FeedinTable pdr={pdr} mdr={mdr} onBestTariffFound={bestTariffFound}/>
						</div>
					</>
				)}
			</main>
		</div>
	)
}