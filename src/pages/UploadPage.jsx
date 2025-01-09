import React from 'react'
import { useState } from "react";
import { Zap, CalendarFold, Sun } from 'lucide-react'
import { motion } from "framer-motion"
import { format } from "date-fns";

import Header from '../layout/Header'
import StatCard from '../components/StatCard'
import FileUploader from '../components/FileUploader'
import QuantityChart from '../charts/QuantityChart'

import { importProviderFile } from '../features/import/smartmeter-file-adapter'
import { round1Digit } from '../scripts/round';

import { PROVIDERS_USAGE } from "../data/providers-usage"
import { PROVIDERS_FEEDIN } from "../data/providers-feedin"

export default function UploadPage({usagePDR, feedinPDR, onUsagePDRChanged, onFeedinPDRChanged}) {

	const [errorUsage, setErrorUsage] = useState(false);
	const [errorFeedin, setErrorFeedin] = useState(false);

	function handleFileUsageUploaded(fileName, fileContent) {
		const usagePDRFound = importProviderFile(fileContent, PROVIDERS_USAGE);
		usagePDRFound.fileName = fileName;
		if (usagePDRFound.hourData)
			onUsagePDRChanged(usagePDRFound);
		else
			setErrorUsage(true);	
	}

	function handleFileFeedinUploaded(fileName, fileContent) {
		const feedinPDRFound = importProviderFile(fileContent, PROVIDERS_FEEDIN);
		feedinPDRFound.fileName = fileName;
		if (feedinPDRFound.hourData)
			onFeedinPDRChanged(feedinPDRFound);
		else
			setErrorFeedin(true);	
	}

	return (
		<div className='flex-1 overflow-auto realtive z-10'>
			<Header title="Upload" />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				{/* UPLOADER */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
					<FileUploader title="Stromverbrauch" importError={errorUsage} onFileUploaded={handleFileUsageUploaded} pdr={usagePDR} demoFile="NetzNOE-Jahresverbrauch-2024.csv"/>
					<FileUploader title="Stromeinspeisung" importError={errorFeedin} onFileUploaded={handleFileFeedinUploaded} pdr={feedinPDR} demoFile="NetzNOE-Jahreseinspeisung-2024.csv"/>
				</div>
				
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					{ usagePDR.utcHourFrom && (
						<>
							<StatCard title='Netzanbieter Verbrauch' icon={Zap} text={usagePDR.provider} color='#6366F1' />
							<StatCard title='Zeitraum Verbrauch' icon={CalendarFold} text={format(usagePDR.utcHourFrom, "dd.MM.yyyy") + " - " + format(usagePDR.utcHourTo-3600000, "dd.MM.yyyy")} sub={round1Digit(usagePDR.kwh) + " kWh"} color='#8B5CF6' />
						</>
					)}
					{ !usagePDR.hourData && (
						<>
							<div className='p-6'/>
							<div className='p-6'/>
						</>
					)}
					{ feedinPDR.utcHourFrom && (
						<>
							<StatCard title='Netzanbieter Einspeisung' icon={Sun} text={feedinPDR.provider} color='#6366F1' />
							<StatCard title='Zeitraum Einspeisung' icon={CalendarFold} text={format(feedinPDR.utcHourFrom, "dd.MM.yyyy") + " - " + format(feedinPDR.utcHourTo-3600000, "dd.MM.yyyy")} sub={round1Digit(feedinPDR.kwh) + " kWh"} color='#8B5CF6' />
						</>
					)}
				</motion.div>

				{/* CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
				{ usagePDR.hourData && (
					<QuantityChart title="Verbrauch nach Monat" hourData={usagePDR.hourData}/>
				)}
				{ !usagePDR.hourData && (
					<div className='p-6'/>
				)}
				{ feedinPDR.hourData && (
					<QuantityChart title="Einspeisung nach Monat" hourData={feedinPDR.hourData}/>
				)}
				</div>
			</main>
		</div>
	)
}

