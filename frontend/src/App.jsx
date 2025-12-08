// Importera React Router komponenter för navigation
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// Importera våra sidor
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'
// Importera CSS för styling
import './App.css'

// Detta är huvudkomponenten för hela applikationen
function App() {
  return (
    // BrowserRouter låter oss använda navigation i hela appen
    <Router>
      <div className="app">
        {/* Header med titel */}
        <header className="app-header">
          <h1>Strajk Bowling</h1>
          <p>Boka din tid i centrala Bromölla</p>
        </header>
        
        {/* Huvudinnehåll */}
        <main className="app-main">
          {/* Routes definierar vilka sidor som finns och vilka URL:er de har */}
          <Routes>
            {/* När användaren är på "/" (startsidan), visa BookingPage */}
            <Route path="/" element={<BookingPage />} />
            
            {/* När användaren är på "/bekraftelse", visa ConfirmationPage */}
            <Route path="/bekraftelse" element={<ConfirmationPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

// Exportera komponenten så den kan användas i main.jsx
export default App
