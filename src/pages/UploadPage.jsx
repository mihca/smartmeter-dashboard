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

import { PROVIDERS_CONSUMPTION } from "../data/providers-consumption"
import { PROVIDERS_FEEDIN } from "../data/providers-feedin"

export default function UploadPage({consumptionPDR, feedinPDR, onConsumptionPDRChanged, onFeedinPDRChanged}) {

	const [errorConsumption, setErrorConsumption] = useState(false);
	const [errorFeedin, setErrorFeedin] = useState(false);

	function handleFileConsumptionUploaded(fileName, fileContent) {
		const consumptionPDRFound = importProviderFile(fileContent, PROVIDERS_CONSUMPTION);
		consumptionPDRFound.fileName = fileName;
		if (consumptionPDRFound.hourData)
			onConsumptionPDRChanged(consumptionPDRFound);
		else
			setErrorConsumption(true);	
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
					<FileUploader title="Strombezug" importError={errorConsumption} onFileUploaded={handleFileConsumptionUploaded} pdr={consumptionPDR} demoFile="NetzNOE-Jahresverbrauch-2024.csv"/>
					<FileUploader title="Stromeinspeisung" importError={errorFeedin} onFileUploaded={handleFileFeedinUploaded} pdr={feedinPDR} demoFile="NetzNOE-Jahreseinspeisung-2024.csv"/>
				</div>
				
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					{ consumptionPDR.utcHourFrom && (
						<>
							<StatCard title='Netzanbieter Bezug' icon={Zap} text={consumptionPDR.provider} color='#6366F1' />
							<StatCard title='Zeitraum Bezug' icon={CalendarFold} text={format(consumptionPDR.utcHourFrom, "dd.MM.yyyy") + " - " + format(consumptionPDR.utcHourTo-3600000, "dd.MM.yyyy")} sub={round1Digit(consumptionPDR.kwh) + " kWh"} color='#8B5CF6' />
						</>
					)}
					{ !consumptionPDR.hourData && (
						<>
							<div className='p-6'/>
							<div className='p-6'/>
						</>
					)}
					{ feedinPDR.utcHourFrom && (
						<>
							<StatCard title='Bilanz' icon={Sun} text={round1Digit(feedinPDR.kwh-consumptionPDR.kwh) + " kWh"} color='#6366F1' />
							<StatCard title='Zeitraum Einspeisung' icon={CalendarFold} text={format(feedinPDR.utcHourFrom, "dd.MM.yyyy") + " - " + format(feedinPDR.utcHourTo-3600000, "dd.MM.yyyy")} sub={round1Digit(feedinPDR.kwh) + " kWh"} color='#8B5CF6' />
						</>
					)}
				</motion.div>

				{/* CHARTS */}
				<div className={`grid grid-cols-1 gap-5 mb-8 ${(consumptionPDR.hourData && feedinPDR.hourData) ? 'lg:grid-cols-1' : 'lg:grid-cols-2'}`}>
				{ consumptionPDR.hourData && !feedinPDR.hourData && (
					<QuantityChart title="Bezug nach Monat" hourData1={consumptionPDR.hourData} name1="Bezug" color1="#a84e09"/>
				)}
				{ !consumptionPDR.hourData && feedinPDR.hourData && (
					<>
						<div className='p-6'/>
						<QuantityChart title="Einspeisung nach Monat" hourData1={feedinPDR.hourData} name1="Einspeisung" color1="#ffc000"/>
					</>
				)}
				{ feedinPDR.hourData && consumptionPDR.hourData && (
					<QuantityChart 
						title="Bezug und Einspeisung nach Monat" 
						hourData1={consumptionPDR.hourData} 
						hourData2={feedinPDR.hourData}
						name1="Bezug"
						color1="#a84e09"
						name2="Einspeisung"
						color2="#ffc000"
						/>
				)}
				</div>
			</main>
		</div>
	)
}

