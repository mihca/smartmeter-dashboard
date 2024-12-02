import { useState } from 'react'
import UploadPage from "./pages/UploadPage"
import MarketpricePage from "./pages/MarketpricePage"
import UsageCalculatorPage from './pages/UsageCalculatorPage'
import { Route } from "react-router-dom"
import { Routes } from "react-router-dom"
import Sidebar from "./layout/Sidebar"
import { PrimeReactProvider } from 'primereact/api';

const EMPTY_PDR = {
	provider: "-",
	dateFrom: "",
	dateTo: "",
	fileName: null,
	hourData: null
}

function App() {

	const [usagePDR, setUsagePDR] = useState(EMPTY_PDR);
	const [feedinPDR, setFeedinPDR] = useState(EMPTY_PDR);
	const [marketPrices, setMarketPrices] = useState(new Map());

	function usagePDRChanged(pdr) {
		setUsagePDR(pdr);			
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
						/>} 
					/>
					<Route path='/marketprice' element={<MarketpricePage/>} />
					</Routes>
			</PrimeReactProvider>
		</div>
	);
}

export default App