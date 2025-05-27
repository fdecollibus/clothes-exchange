import { Routes, Route } from 'react-router-dom'
import Checkout from './pages/Checkout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Checkout />} />
    </Routes>
  )
}

export default App 