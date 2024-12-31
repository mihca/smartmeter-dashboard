import { useState } from 'react'
import { Route } from "react-router-dom"
import { Routes } from "react-router-dom"

import UploadPage from "./pages/UploadPage"
import MarketpricePage from "./pages/MarketpricePage"
import UsageCalculatorPage from './pages/UsageCalculatorPage'
import FeedinCalculatorPage from './pages/FeedinCalculatorPage'
import StorageSimulatorPage from './pages/StorageSimulatorPage'

import Sidebar from "./layout/Sidebar"
import { fetchMarketDataRecord } from './scripts/fetch-awattar';
import useLocalStorage from "./hooks/useLocalStorage";

const EMPTY_PDR = {
	provider: "-",
	utcHourFrom: null,
	utcHourTo: null,
	fileName: null,
	hourData: null
}

const EMPTY_MDR = {
	country: "-",
	utcHourFrom: null,
	utcHourTo: null,
	hourMap: new Map()
}

function App() {

	const [usagePDR, setUsagePDR] = useState(EMPTY_PDR);
	const [feedinPDR, setFeedinPDR] = useState(EMPTY_PDR);
	const [marketDataRecord, setMarketDataRecord] = useLocalStorage("smartmeter.dashboard.mdr.at", EMPTY_MDR);
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState(null);

	async function usagePDRChanged(pdr) {
		setUsagePDR(pdr);
		updateMarketDataRecord(pdr);
	}

	async function feedinPDRChanged(pdr) {
		setFeedinPDR(pdr);			
		updateMarketDataRecord(pdr);
	}

	async function updateMarketDataRecord(pdr) {
		setIsFetching(true);
		try {
			// Fetch market data one hour earlier (-3600000) than usage data, 
			// because usage data shows end of hour and marketprice is valid at start of hour
			const fetchedMDR = await fetchMarketDataRecord (marketDataRecord, pdr.utcHourFrom - 3600000, pdr.utcHourTo);
			setMarketDataRecord(fetchedMDR);
			setIsFetching(false);
		} catch (error) {
			setError(error.message);
			setIsFetching(false);
		}
	}
	
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<Routes>
				<Route path='/' element={
					<UploadPage 
						usagePDR={usagePDR} 
						feedinPDR={feedinPDR}
						onUsagePDRChanged={usagePDRChanged}
						onFeedinPDRChanged={feedinPDRChanged}
					/>} 
				/>
				<Route path='/usage-calculator' element={
					<UsageCalculatorPage
						pdr={usagePDR}
						mdr={marketDataRecord}
					/>} 
				/>
				<Route path='/feedin-calculator' element={
					<FeedinCalculatorPage
						pdr={feedinPDR}
						mdr={marketDataRecord}
					/>} 
				/>
				<Route path='/storage-simulator' element={
					<StorageSimulatorPage
						usagePDR={usagePDR}
						feedinPDR={feedinPDR}
						mdr={marketDataRecord}
					/>} 
				/>
				<Route path='/marketprice' element={
					<MarketpricePage
						mdr={marketDataRecord}
					/>} 
				/>
				</Routes>
		</div>
	);
}

export default App