import React from 'react'
import { Zap, CalendarFold, Sun } from 'lucide-react'
import { motion } from "framer-motion"
import { format } from "date-fns";

import Header from '../layout/Header'
import StatCard from '../components/StatCard'
import FileUploader from '../components/FileUploader'
import UsageChart from '../charts/UsageChart'

import { importProviderFile } from '../scripts/smartmeter-file-adapter'

import { PROVIDERS_USAGE } from "../data/providers-usage"
import { PROVIDERS_FEEDIN } from "../data/providers-feedin"

export default function UploadPage({usagePDR, feedinPDR, onUsagePDRChanged, onFeedinPDRChanged}) {

	function handleFileUsageUploaded(fileName, fileContent) {
		const usagePDRFound = importProviderFile(fileContent, PROVIDERS_USAGE);
		usagePDRFound.fileName = fileName;
		onUsagePDRChanged(usagePDRFound);			
	}

	function handleFileFeedinUploaded(fileName, fileContent) {
		const feedinPDRFound = importProviderFile(fileContent, PROVIDERS_FEEDIN);
		feedinPDRFound.fileName = fileName;
		onFeedinPDRChanged(feedinPDRFound);
	}

	return (
		<div className='flex-1 overflow-auto realtive z-10'>
			<Header title="Upload" />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				{/* UPLOADER */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
					<FileUploader title="Stromverbrauch" description="Erklärung Verbrauch" onFileUploaded={handleFileUsageUploaded} pdr={usagePDR}/>
					<FileUploader title="Stromeinspeisung" description="Erklärung Einspeisung" onFileUploaded={handleFileFeedinUploaded} pdr={feedinPDR}/>
				</div>
				
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Provider Verbrauch' icon={Zap} value={usagePDR.provider} color='#6366F1' />
					{ !usagePDR.utcHourFrom && (
						<StatCard name='Zeitraum Verbrauch' icon={CalendarFold} value="-" color='#8B5CF6' />
					)}
					{ usagePDR.utcHourFrom && (
						<StatCard name='Zeitraum Verbrauch' icon={CalendarFold} value={format(usagePDR.utcHourFrom, "dd.MM.yyyy") + " - " + format(usagePDR.utcHourTo, "dd.MM.yyyy")} color='#8B5CF6' />
					)}
					<StatCard name='Provider Einspeisung' icon={Sun} value={feedinPDR.provider} color='#6366F1' />
					{ !feedinPDR.utcHourFrom && (
						<StatCard name='Zeitraum Verbrauch' icon={CalendarFold} value="-" color='#8B5CF6' />
					)}
					{ feedinPDR.utcHourFrom && (
						<StatCard name='Zeitraum Verbrauch' icon={CalendarFold} value={format(feedinPDR.utcHourFrom, "dd.MM.yyyy") + " - " + format(feedinPDR.utcHourTo, "dd.MM.yyyy")} color='#8B5CF6' />
					)}
				</motion.div>

				{/* CHARTS */}
				{ usagePDR.hourData && (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
					<UsageChart hourData={usagePDR.hourData}/>
				</div>
				)}
			</main>
		</div>
	)
}

