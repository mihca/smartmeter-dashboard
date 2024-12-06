import { useState } from 'react'
import { Route } from "react-router-dom"
import { Routes } from "react-router-dom"

import { PrimeReactProvider } from 'primereact/api';

import UploadPage from "./pages/UploadPage"
import MarketpricePage from "./pages/MarketpricePage"
import UsageCalculatorPage from './pages/UsageCalculatorPage'

import Sidebar from "./layout/Sidebar"
import { fetchMarketData } from './scripts/fetch-awattar';

const EMPTY_PDR = {
	provider: "-",
	utcHourFrom: null,
	utcHourTo: null,
	fileName: null,
	hourData: null
}

function App() {

	const [usagePDR, setUsagePDR] = useState(EMPTY_PDR);
	const [feedinPDR, setFeedinPDR] = useState(EMPTY_PDR);
	const [marketData, setMarketData] = useState(new Map());
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState(null);

	async function usagePDRChanged(pdr) {
		
		setUsagePDR(pdr);
		console.log(pdr);

		try {
			// Fetch market data one hour earlier (-3600000) than usage data, 
			// because usage data shows end of hour and marketprice is valid at start of hour
			const fetchedMarketData = await fetchMarketData (pdr.utcHourFrom - 3600000, pdr.utcHourTo);
			setMarketData(fetchedMarketData);
			setIsFetching(false);
		} catch (error) {
			setError(error.message);
			setIsFetching(false);
		}
	}

	function feedinPDRChanged(pdr) {
		setFeedinPDR(pdr);			
	}

	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<PrimeReactProvider>
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
							marketData={marketData}
						/>} 
					/>
					<Route path='/marketprice' element={
						<MarketpricePage
							marketData={marketData}
						/>} 
					/>
					</Routes>
			</PrimeReactProvider>
		</div>
	);
}

export default App