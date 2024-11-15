import UploadPage from "./pages/UploadPage"
import MarketpricePage from "./pages/MarketpricePage"
import { Route } from "react-router-dom"
import { Routes } from "react-router-dom"
import Sidebar from "./layout/Sidebar"
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

function App() {
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
					<Route path='/' element={<UploadPage />} />
					<Route path='/marketprice' element={<MarketpricePage />} />
				</Routes>
			</PrimeReactProvider>
		</div>
	);
}

export default App