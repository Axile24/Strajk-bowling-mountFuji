import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ConfirmationPage.css'

function ConfirmationPage() {
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    // Hämta bokning från session storage
    const savedBooking = sessionStorage.getItem('booking')
    if (savedBooking) {
      try {
        setBooking(JSON.parse(savedBooking))
      } catch (error) {
        console.error('Fel vid läsning av bokning:', error)
      }
    }
  }, [])

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

  // Beräkna uppdelning av kostnad
  const playerCost = booking.players.length * 120
  const laneCost = booking.lanes * 100

  return (
    <div className="confirmation-page">
      {/* data-testid behövs för tester: User Story 5 - Visa bokningsinformation när bokning finns */}
      <div className="confirmation-card" data-testid="confirmation-card">
        <h2>Bokning bekräftad!</h2>
        
        <div className="booking-info">
          <div className="info-section">
            <h3>Bokningsnummer</h3>
            {/* data-testid behövs för tester: User Story 4 - Systemet ska generera och visa bokningsnummer */}
            <p className="booking-number" data-testid="booking-number">
              {booking.bookingNumber}
            </p>
          </div>

          <div className="info-section">
            <h3>Bokningsdetaljer</h3>
            <p><strong>Datum:</strong> {booking.date}</p>
            <p><strong>Tid:</strong> {booking.time}</p>
            <p><strong>Antal spelare:</strong> {booking.players.length}</p>
            <p><strong>Antal banor:</strong> {booking.lanes}</p>
          </div>

          {booking.shoeSizes && booking.shoeSizes.length > 0 && (
            <div className="info-section">
              <h3>Skostorlekar</h3>
              <ul className="shoe-list">
                {/* data-testid behövs för tester: User Story 2 - Visa skostorlekar i bekräftelse */}
                {booking.shoeSizes.map((shoe, index) => (
                  <li key={index} data-testid={`shoe-size-display-${shoe.player}`}>
                    Spelare {shoe.player}: Storlek {shoe.size}
                  </li>
                ))}
              </ul>
            </div>
          )}

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

        <button onClick={() => navigate('/')} className="back-button">
          Gör en ny bokning
        </button>
      </div>
    </div>
  )
}

export default ConfirmationPage

