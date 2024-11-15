import React from 'react'
import Header from '../layout/Header'
import {motion} from "framer-motion"
import StatCard from '../components/StatCard'
import { BarChart2, Zap, Users, ShoppingBag } from 'lucide-react';
import SingleFileUploader from '../components/SingleFileUploader';

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
				<StatCard name='Total Sales' icon={Zap} value='$12,345' color='#6366F1' />
				<StatCard name='New Users' icon={Users} value='1,234' color='#8B5CF6' />
				<StatCard name='Total Products' icon={ShoppingBag} value='567' color='#EC4899' />
				<StatCard name='Conversion Rate' icon={BarChart2} value='12.5%' color='#10B981' />
			</motion.div>

			{/* CHARTS */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{ /* <SalesOverviewChart /> */ }
				<SingleFileUploader/>
			</div>
		</main>
    </div>
  )
}

