import OverviewPage from "./pages/OverviewPage"
import { Route } from "react-router-dom"
import { Routes } from "react-router-dom"

function App() {

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <Routes>
          <Route path="/" element={<OverviewPage/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
