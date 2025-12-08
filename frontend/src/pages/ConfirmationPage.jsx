// Importera React hooks
import { useEffect, useState } from 'react'
// Importera navigation från React Router
import { useNavigate } from 'react-router-dom'
// Importera CSS-filen för styling
import './ConfirmationPage.css'

// Detta är komponenten för bekräftelsesidan
function ConfirmationPage() {
  // useNavigate låter oss navigera till andra sidor
  const navigate = useNavigate()
  
  // State för bokningen - börjar med null (ingen bokning)
  const [booking, setBooking] = useState(null)

  // useEffect körs när komponenten laddas första gången
  useEffect(() => {
    // Hämta bokning från session storage (där vi sparade den på bokningssidan)
    const savedBooking = sessionStorage.getItem('booking')
    
    if (savedBooking) {
      try {
        // JSON.parse gör om text tillbaka till JavaScript-objekt
        setBooking(JSON.parse(savedBooking))
      } catch (error) {
        // Om det inte går att läsa, visa fel i konsolen
        console.error('Fel vid läsning av bokning:', error)
      }
    }
  }, [])  // Tom array [] betyder "kör bara en gång när komponenten laddas"

  // Om det inte finns någon bokning, visa "Ingen bokning gjord"
  if (!booking) {
    return (
      <div className="confirmation-page">
        {/* data-testid behövs för tester: User Story 5 - Visa "Ingen bokning gjord" när ingen bokning finns */}
        <div className="no-booking" data-testid="no-booking-message">
          <p>Ingen bokning gjord</p>
          <button onClick={() => navigate('/')} className="back-button">
            Gå tillbaka till bokning
          </button>
        </div>
      </div>
    )
  }

  // Beräkna kostnadsuppdelning
  // 120 kr per person
  const playerCost = booking.players.length * 120
  // 100 kr per bana
  const laneCost = booking.lanes * 100

  // Om det finns en bokning, visa bekräftelsen
  return (
    <div className="confirmation-page">
      {/* data-testid behövs för tester: User Story 5 - Visa bokningsinformation när bokning finns */}
      <div className="confirmation-card" data-testid="confirmation-card">
        <h2>Bokning bekräftad!</h2>
        
        <div className="booking-info">
          {/* Visa bokningsnummer */}
          <div className="info-section">
            <h3>Bokningsnummer</h3>
            {/* data-testid behövs för tester: User Story 4 - Systemet ska generera och visa bokningsnummer */}
            <p className="booking-number" data-testid="booking-number">
              {booking.bookingNumber}
            </p>
          </div>

          {/* Visa bokningsdetaljer */}
          <div className="info-section">
            <h3>Bokningsdetaljer</h3>
            <p><strong>Datum:</strong> {booking.date}</p>
            <p><strong>Tid:</strong> {booking.time}</p>
            <p><strong>Antal spelare:</strong> {booking.players.length}</p>
            <p><strong>Antal banor:</strong> {booking.lanes}</p>
          </div>

          {/* Visa skostorlekar om det finns några */}
          {booking.shoeSizes && booking.shoeSizes.length > 0 && (
            <div className="info-section">
              <h3>Skostorlekar</h3>
              <ul className="shoe-list">
                {/* data-testid behövs för tester: User Story 2 - Visa skostorlekar i bekräftelse */}
                {/* Loopa igenom alla skostorlekar och visa dem */}
                {booking.shoeSizes.map((shoe, index) => (
                  <li key={index} data-testid={`shoe-size-display-${shoe.player}`}>
                    Spelare {shoe.player}: Storlek {shoe.size}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Visa kostnadsuppdelning */}
          <div className="info-section">
            <h3>Kostnad</h3>
            {/* data-testid behövs för tester: User Story 4 - Visa uppdelning mellan spelare och banor */}
            <div className="cost-breakdown" data-testid="cost-breakdown">
              <p>Spelare ({booking.players.length} × 120 kr): <strong>{playerCost} kr</strong></p>
              <p>Banor ({booking.lanes} × 100 kr): <strong>{laneCost} kr</strong></p>
            </div>
            {/* data-testid behövs för tester: User Story 4 - Visa totala summan */}
            <div className="total-cost" data-testid="total-cost">
              <p><strong>Totalt: {booking.totalPrice} kr</strong></p>
            </div>
          </div>
        </div>

        {/* Knapp för att göra en ny bokning */}
        <button onClick={() => navigate('/')} className="back-button">
          Gör en ny bokning
        </button>
      </div>
    </div>
  )
}

// Exportera komponenten så den kan användas i andra filer
export default ConfirmationPage
