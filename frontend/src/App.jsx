import { Routes, Route } from 'react-router-dom'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Strajk Bowling</h1>
        <p>Boka din tid i centrala Bromölla</p>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/bekraftelse" element={<ConfirmationPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

