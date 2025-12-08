import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BookingPage.css'

function BookingPage() {
  const navigate = useNavigate()
  
  // State för bokningen
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)
  const [shoeSizes, setShoeSizes] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Beräkna antal banor (1 bana per 4 spelare, minst 1 bana)
  const numberOfLanes = Math.max(1, Math.ceil(numberOfPlayers / 4))

  // Hantera ändring av antal spelare
  const handlePlayerCountChange = (e) => {
    const count = parseInt(e.target.value) || 1
    setNumberOfPlayers(count)
    
    // Uppdatera skostorlekar - ta bort för spelare som inte längre finns
    const newShoeSizes = {}
    for (let i = 1; i <= count; i++) {
      if (shoeSizes[i]) {
        newShoeSizes[i] = shoeSizes[i]
      }
    }
    setShoeSizes(newShoeSizes)
  }

  // Hantera ändring av skostorlek
  const handleShoeSizeChange = (playerIndex, size) => {
    setShoeSizes({
      ...shoeSizes,
      [playerIndex]: size
    })
  }

  // Ta bort skostorlek för en spelare
  const handleRemoveShoeSize = (playerIndex) => {
    const newShoeSizes = { ...shoeSizes }
    delete newShoeSizes[playerIndex]
    setShoeSizes(newShoeSizes)
  }

  // Hantera bokning
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Skapa array med spelare och deras skostorlekar
      const players = []
      for (let i = 1; i <= numberOfPlayers; i++) {
        players.push({
          playerNumber: i,
          shoeSize: shoeSizes[i] || null
        })
      }

      // Skicka bokning till backend
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          time,
          players: players.map(p => p.playerNumber),
          lanes: numberOfLanes,
          shoeSizes: Object.entries(shoeSizes).map(([player, size]) => ({
            player: parseInt(player),
            size: parseInt(size)
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Bokningen misslyckades')
      }

      const booking = await response.json()

      // Spara i session storage
      sessionStorage.setItem('booking', JSON.stringify(booking))

      // Navigera till bekräftelse
      navigate('/bekraftelse')
    } catch (error) {
      console.error('Fel vid bokning:', error)
      alert('Något gick fel. Försök igen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="booking-page">
      <h2>Boka din bowlingtid</h2>
      
      <form onSubmit={handleSubmit} className="booking-form">
        {/* Datum */}
        {/* data-testid behövs för tester: User Story 1 - Användaren ska kunna välja ett datum */}
        <div className="form-group">
          <label htmlFor="date">
            Välj datum <span className="required">*</span>
          </label>
          <input
            type="date"
            id="date"
            data-testid="date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Tid */}
        {/* data-testid behövs för tester: User Story 1 - Användaren ska kunna välja en tid */}
        <div className="form-group">
          <label htmlFor="time">
            Välj tid <span className="required">*</span>
          </label>
          <input
            type="time"
            id="time"
            data-testid="time-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        {/* Antal spelare */}
        {/* data-testid behövs för tester: User Story 1 - Användaren ska kunna ange antal spelare */}
        <div className="form-group">
          <label htmlFor="players">
            Antal spelare <span className="required">*</span>
          </label>
          <input
            type="number"
            id="players"
            data-testid="players-input"
            min="1"
            value={numberOfPlayers}
            onChange={handlePlayerCountChange}
            required
          />
          <p className="help-text">
            Antal banor som bokas: {numberOfLanes} (1 bana per 4 spelare)
          </p>
        </div>

        {/* Skostorlekar */}
        <div className="form-group">
          <label>Skostorlekar (valfritt)</label>
          <div className="shoe-sizes">
            {/* data-testid behövs för tester: User Story 2 & 3 - Testa skostorleksval och borttagning */}
            {Array.from({ length: numberOfPlayers }, (_, i) => {
              const playerIndex = i + 1
              const hasShoeSize = shoeSizes[playerIndex]
              
              return (
                <div key={playerIndex} className="shoe-size-row" data-testid={`shoe-size-row-${playerIndex}`}>
                  <label htmlFor={`shoe-${playerIndex}`}>
                    Spelare {playerIndex}:
                  </label>
                  <input
                    type="number"
                    id={`shoe-${playerIndex}`}
                    data-testid={`shoe-size-input-${playerIndex}`}
                    min="30"
                    max="50"
                    value={shoeSizes[playerIndex] || ''}
                    onChange={(e) => handleShoeSizeChange(playerIndex, e.target.value)}
                    placeholder="Välj skostorlek"
                  />
                  {hasShoeSize && (
                    <button
                      type="button"
                      data-testid={`remove-shoe-${playerIndex}`}
                      onClick={() => handleRemoveShoeSize(playerIndex)}
                      className="remove-button"
                      aria-label={`Ta bort skostorlek för spelare ${playerIndex}`}
                    >
                      -
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        {/* data-testid behövs för tester: User Story 4 - Användaren ska kunna slutföra bokningen */}
        <button
          type="submit"
          data-testid="submit-booking-button"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Bokar...' : 'Slutför bokning'}
        </button>
      </form>
    </div>
  )
}

export default BookingPage

