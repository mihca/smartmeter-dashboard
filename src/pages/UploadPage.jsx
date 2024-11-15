import React from 'react'
import Header from '../layout/Header'
import {motion} from "framer-motion"
import StatCard from '../components/StatCard'
import { BarChart2, Zap, Users, ShoppingBag } from 'lucide-react';
import FileUploader from '../components/FileUploader';

export default function UploadPage () {
  return (
    <div className='flex-1 overflow-auto realtive z-10'>
		<Header title="Upload"/>
		<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
			{/* STATS */}
			<motion.div
				className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				<StatCard name='Provider Verbrauch' icon={Zap} value='Netz NÖ' color='#6366F1' />
				<StatCard name='Zeitraum Verbrauch' icon={Users} value='01.01. - 14.11.2024' color='#8B5CF6' />
				<StatCard name='Provider Einspeisung' icon={Zap} value='-' color='#6366F1' />
				<StatCard name='Zeitraum Einspeisung' icon={Users} value='-' color='#8B5CF6' />
			</motion.div>

			{/* CHARTS */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{ /* <SalesOverviewChart /> */ }
				<FileUploader title="Stromverbrauch" description="Hallo"/>
				<FileUploader title="Stromeinspeisung" description="Bla bla"/>
			</div>
		</main>
    </div>
  )
}

