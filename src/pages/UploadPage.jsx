import React, { useState } from 'react'
import { Zap, CalendarFold, Sun } from 'lucide-react';
import { motion } from "framer-motion"

import Header from '../layout/Header'
import StatCard from '../components/StatCard'
import FileUploader from '../components/FileUploader';
import { importProviderFile } from '../business/smartmeter-file-adapter';

import { PROVIDERS_USAGE } from "../data/providers-usage";
import { PROVIDERS_FEEDIN } from "../data/providers-feedin";

const EMPTY_POWER_RECORD = {
	provider: "-",
	dateFrom: "",
	dateTo: "",
	data: []
}

export default function UploadPage() {

	const [usageData, setUsageData] = useState(EMPTY_POWER_RECORD);
	const [feedinData, setFeedinData] = useState(EMPTY_POWER_RECORD);

	function handleFileUsageUploaded(fileContent) {
		const usagePowerRecord = importProviderFile(fileContent, PROVIDERS_USAGE);
		setUsageData(usagePowerRecord);			
	}

	function handleFileFeedinUploaded(fileContent) {
		const feedinPowerRecord = importProviderFile(fileContent, PROVIDERS_FEEDIN);
		setFeedinData(feedinPowerRecord);
	}

	return (
		<div className='flex-1 overflow-auto realtive z-10'>
			<Header title="Upload" />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				{/* UOLOADER */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
					<FileUploader title="Stromverbrauch" description="Erklärung Verbrauch" onFileUploaded={handleFileUsageUploaded} />
					<FileUploader title="Stromeinspeisung" description="Erklärung Einspeisung" onFileUploaded={handleFileFeedinUploaded} />
				</div>
				
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Provider Verbrauch' icon={Zap} value={usageData.provider} color='#6366F1' />
					<StatCard name='Zeitraum Verbrauch' icon={CalendarFold} value={usageData.dateFrom + " - " + usageData.dateTo} color='#8B5CF6' />
					<StatCard name='Provider Einspeisung' icon={Sun} value={feedinData.provider} color='#6366F1' />
					<StatCard name='Zeitraum Einspeisung' icon={CalendarFold} value={feedinData.dateFrom + " - " + feedinData.dateTo} color='#8B5CF6' />
				</motion.div>

			</main>
		</div>
	)
}

