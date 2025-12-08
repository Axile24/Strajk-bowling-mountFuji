// Importera React hooks (funktioner vi behöver från React)
import { useState } from 'react'
// Importera navigation från React Router (för att kunna navigera mellan sidor)
import { useNavigate } from 'react-router-dom'
// Importera CSS-filen för styling
import './BookingPage.css'

// Detta är huvudkomponenten för bokningssidan
function BookingPage() {
  // useNavigate låter oss navigera till andra sidor
  const navigate = useNavigate()
  
  // useState används för att spara data som kan ändras
  // När data ändras, uppdateras sidan automatiskt
  
  // State för datum - börjar tomt
  const [date, setDate] = useState('')
  
  // State för tid - börjar tomt
  const [time, setTime] = useState('')
  
  // State för antal spelare - börjar med 1
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)
  
  // State för skostorlekar - ett objekt där nyckeln är spelarnummer och värdet är skostorlek
  // Exempel: { 1: 42, 2: 40 } betyder spelare 1 har storlek 42, spelare 2 har storlek 40
  const [shoeSizes, setShoeSizes] = useState({})
  
  // State för att veta om vi håller på att skicka bokningen (för att visa "Bokar..." text)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Beräkna antal banor automatiskt
  // 1 bana per 4 spelare, minst 1 bana
  // Exempel: 4 spelare = 1 bana, 5 spelare = 2 banor, 8 spelare = 2 banor
  const numberOfLanes = Math.max(1, Math.ceil(numberOfPlayers / 4))

  // Funktion som körs när användaren ändrar antal spelare
  const handlePlayerCountChange = (e) => {
    // e.target.value är det nya värdet från input-fältet
    // parseInt gör om text till nummer, || 1 betyder "eller 1" om det inte går
    const count = parseInt(e.target.value) || 1
    
    // Uppdatera antal spelare
    setNumberOfPlayers(count)
    
    // Om användaren minskar antal spelare, ta bort skostorlekar för spelare som inte längre finns
    // Skapa ett nytt objekt med bara de skostorlekar som fortfarande behövs
    const newShoeSizes = {}
    for (let i = 1; i <= count; i++) {
      // Om spelare i har en skostorlek, behåll den
      if (shoeSizes[i]) {
        newShoeSizes[i] = shoeSizes[i]
      }
    }
    setShoeSizes(newShoeSizes)
  }

  // Funktion som körs när användaren ändrar skostorlek för en spelare
  const handleShoeSizeChange = (playerIndex, size) => {
    // Skapa ett nytt objekt med alla gamla skostorlekar + den nya/ändrade
    // ...shoeSizes betyder "kopiera alla gamla skostorlekar"
    setShoeSizes({
      ...shoeSizes,
      [playerIndex]: size  // Uppdatera eller lägg till skostorlek för denna spelare
    })
  }

  // Funktion som körs när användaren klickar på "-" knappen för att ta bort skostorlek
  const handleRemoveShoeSize = (playerIndex) => {
    // Kopiera alla skostorlekar
    const newShoeSizes = { ...shoeSizes }
    // Ta bort skostorleken för denna spelare
    delete newShoeSizes[playerIndex]
    // Uppdatera state
    setShoeSizes(newShoeSizes)
  }

  // Funktion som körs när användaren klickar på "Slutför bokning"
  const handleSubmit = async (e) => {
    // Förhindra att sidan laddas om (standard beteende för formulär)
    e.preventDefault()
    
    // Sätt isSubmitting till true så att knappen visar "Bokar..."
    setIsSubmitting(true)

    // try/catch används för att hantera fel
    try {
      // Skapa en lista med alla spelare och deras skostorlekar
      const players = []
      for (let i = 1; i <= numberOfPlayers; i++) {
        players.push({
          playerNumber: i,
          shoeSize: shoeSizes[i] || null  // Om spelare inte har skostorlek, använd null
        })
      }

      // Skicka bokning till backend-servern
      // fetch är en funktion som skickar HTTP-förfrågningar
      const response = await fetch('/api/bookings', {
        method: 'POST',  // POST betyder "skapa nytt"
        headers: {
          'Content-Type': 'application/json',  // Vi skickar JSON-data
        },
        body: JSON.stringify({  // Gör om JavaScript-objekt till JSON-text
          date,
          time,
          players: players.map(p => p.playerNumber),  // Bara spelarnummer, inte skostorlekar
          lanes: numberOfLanes,
          shoeSizes: Object.entries(shoeSizes).map(([player, size]) => ({
            player: parseInt(player),  // Gör om till nummer
            size: parseInt(size)        // Gör om till nummer
          }))
        }),
      })

      // Om svaret inte är OK (t.ex. 404, 500), kasta ett fel
      if (!response.ok) {
        throw new Error('Bokningen misslyckades')
      }

      // Läs svaret från servern (detta är bokningen med bokningsnummer)
      const booking = await response.json()

      // Spara bokningen i session storage (sparas tills webbläsaren stängs)
      // JSON.stringify gör om JavaScript-objekt till text så det kan sparas
      sessionStorage.setItem('booking', JSON.stringify(booking))

      // Navigera till bekräftelsesidan
      navigate('/bekraftelse')
    } catch (error) {
      // Om något gick fel, visa felmeddelande i konsolen och en alert
      console.error('Fel vid bokning:', error)
      alert('Något gick fel. Försök igen.')
    } finally {
      // Kör alltid detta, även om det gick bra eller dåligt
      // Sätt isSubmitting till false så att knappen fungerar igen
      setIsSubmitting(false)
    }
  }

  // Detta är vad som visas på skärmen (JSX)
  return (
    <div className="booking-page">
      <h2>Boka din bowlingtid</h2>
      
      {/* Formulär för bokning */}
      <form onSubmit={handleSubmit} className="booking-form">
        
        {/* Datum-fält */}
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
            onChange={(e) => setDate(e.target.value)}  // När användaren väljer datum, uppdatera state
            required  // Detta fält måste fyllas i
            min={new Date().toISOString().split('T')[0]}  // Minsta datum är idag
          />
        </div>

        {/* Tid-fält */}
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
            onChange={(e) => setTime(e.target.value)}  // När användaren väljer tid, uppdatera state
            required
          />
        </div>

        {/* Antal spelare-fält */}
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
            onChange={handlePlayerCountChange}  // När användaren ändrar antal spelare, kör denna funktion
            required
          />
          {/* Visa antal banor som kommer bokas */}
          <p className="help-text">
            Antal banor som bokas: {numberOfLanes} (1 bana per 4 spelare)
          </p>
        </div>

        {/* Skostorlekar-fält */}
        <div className="form-group">
          <label>Skostorlekar (valfritt)</label>
          <div className="shoe-sizes">
            {/* data-testid behövs för tester: User Story 2 & 3 - Testa skostorleksval och borttagning */}
            {/* Skapa ett input-fält för varje spelare */}
            {Array.from({ length: numberOfPlayers }, (_, i) => {
              const playerIndex = i + 1  // Spelare börjar på 1, inte 0
              const hasShoeSize = shoeSizes[playerIndex]  // Kolla om spelaren har en skostorlek
              
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
                    value={shoeSizes[playerIndex] || ''}  // Visa skostorleken om den finns, annars tom
                    onChange={(e) => handleShoeSizeChange(playerIndex, e.target.value)}  // När användaren skriver, uppdatera skostorlek
                    placeholder="Välj skostorlek"
                  />
                  {/* Visa "-" knappen bara om spelaren har en skostorlek */}
                  {hasShoeSize && (
                    <button
                      type="button"
                      data-testid={`remove-shoe-${playerIndex}`}
                      onClick={() => handleRemoveShoeSize(playerIndex)}  // När användaren klickar, ta bort skostorlek
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

        {/* Skicka-knapp */}
        {/* data-testid behövs för tester: User Story 4 - Användaren ska kunna slutföra bokningen */}
        <button
          type="submit"
          data-testid="submit-booking-button"
          disabled={isSubmitting}  // Inaktivera knappen medan bokningen skickas
          className="submit-button"
        >
          {/* Visa "Bokar..." medan bokningen skickas, annars "Slutför bokning" */}
          {isSubmitting ? 'Bokar...' : 'Slutför bokning'}
        </button>
      </form>
    </div>
  )
}

// Exportera komponenten så den kan användas i andra filer
export default BookingPage
