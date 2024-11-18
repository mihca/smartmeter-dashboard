import React, { useState } from 'react'
import { Zap, CalendarFold, Sun } from 'lucide-react';
import { motion } from "framer-motion"

import Header from '../layout/Header'
import StatCard from '../components/StatCard'
import FileUploader from '../components/FileUploader';
import { preprocessFileContent } from '../business/preprocess';
import { selectProvider } from '../business/netzbetreiber';
import { PROVIDERS_USAGE } from "../data/providers-usage";
import { PROVIDERS_FEEDIN } from "../data/providers-feedin";


const EMPTY_POWER_DATA = {
	provider: "-",
	dateFrom: "",
	dateTo: "",
	data: []
}

export default function UploadPage() {

	const [usageData, setUsageData] = useState(EMPTY_POWER_DATA);
	const [feedinData, setFeedinData] = useState(EMPTY_POWER_DATA);

	function handleFileUsageUploaded(fileContent) {

		// Input: ByteArray
		// Output: 
		var d = preprocessFileContent(fileContent);
		console.log (d);
		var provider = selectProvider(PROVIDERS_USAGE, d[0]);

		setUsageData({
			provider: provider ? provider.name : "Unbekannt",
			dateFrom: "01.01.2024",
			dateTo: "15.11.2024",
		});			
	}

	function handleFileFeedinUploaded(fileContent) {
		setFeedinData({
			provider: "Netz NÖ",
			dateFrom: "01.01.2024",
			dateTo: "15.11.2024",
		});
	}

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
					<StatCard name='Provider Verbrauch' icon={Zap} value={usageData.provider} color='#6366F1' />
					<StatCard name='Zeitraum Verbrauch' icon={CalendarFold} value={usageData.dateFrom + "-" + usageData.dateTo} color='#8B5CF6' />
					<StatCard name='Provider Einspeisung' icon={Sun} value={feedinData.provider} color='#6366F1' />
					<StatCard name='Zeitraum Einspeisung' icon={CalendarFold} value={feedinData.dateFrom + "-" + feedinData.dateTo} color='#8B5CF6' />
				</motion.div>

				{/* CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{ /* <SalesOverviewChart /> */}
					<FileUploader title="Stromverbrauch" description="Erklärung Verbrauch" onFileUploaded={handleFileUsageUploaded} />
					<FileUploader title="Stromeinspeisung" description="Erklärung Einspeisung" onFileUploaded={handleFileFeedinUploaded} />
				</div>
			</main>
		</div>
	)
}

