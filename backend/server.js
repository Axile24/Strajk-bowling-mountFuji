// Importera Express (ett bibliotek för att skapa webbservrar)
import express from 'express'
// Importera CORS (låter frontend prata med backend)
import cors from 'cors'

// Skapa en Express-applikation
const app = express()

// Välj portnummer - använd miljövariabel PORT om den finns, annars använd 5000
const PORT = process.env.PORT || 5000

// Middleware - kod som körs innan våra routes
// CORS låter frontend (som kör på annan port) prata med backend
app.use(cors())

// express.json() gör så att vi kan läsa JSON-data från förfrågningar
app.use(express.json())

// In-memory storage för enkelhet
// I en riktig applikation skulle vi använda en databas (t.ex. PostgreSQL)
// Men för detta projekt använder vi en array i minnet
let bookings = []
let bookingCounter = 1000  // Börjar på 1000 så bokningsnummer blir STR1000, STR1001, etc.

// API Routes - detta är endpoints (adresser) som frontend kan anropa

// POST /api/bookings - Skapa en ny bokning
app.post('/api/bookings', (req, res) => {
  // req.body innehåller data som frontend skickade
  const { date, time, players, lanes, shoeSizes } = req.body

  // Generera ett unikt bokningsnummer
  // bookingCounter ökar med 1 varje gång, så vi får STR1000, STR1001, STR1002, etc.
  const bookingNumber = `STR${bookingCounter++}`
  
  // Beräkna totalsumma
  // 120 kr per person + 100 kr per bana
  const totalPrice = (players.length * 120) + (lanes * 100)

  // Skapa ett bokningsobjekt med all information
  const booking = {
    bookingNumber,      // Bokningsnummer (t.ex. "STR1000")
    date,              // Datum (t.ex. "2024-12-25")
    time,              // Tid (t.ex. "14:00")
    players,            // Array med spelarnummer (t.ex. [1, 2, 3])
    lanes,              // Antal banor (t.ex. 1)
    shoeSizes,          // Array med skostorlekar (t.ex. [{player: 1, size: 42}])
    totalPrice,         // Totalsumma (t.ex. 340)
    createdAt: new Date().toISOString()  // När bokningen skapades
  }

  // Spara bokningen i vår array
  bookings.push(booking)

  // Skicka tillbaka bokningen till frontend med status 201 (Created)
  res.status(201).json(booking)
})

// GET /api/bookings/:bookingNumber - Hämta en specifik bokning
app.get('/api/bookings/:bookingNumber', (req, res) => {
  // req.params innehåller parametrar från URL:en
  // Om URL:en är /api/bookings/STR1000, så är bookingNumber = "STR1000"
  const { bookingNumber } = req.params
  
  // Hitta bokningen i vår array
  // find() letar igenom arrayen och returnerar första matchningen
  const booking = bookings.find(b => b.bookingNumber === bookingNumber)
  
  // Om bokningen inte hittades, skicka tillbaka 404 (Not Found)
  if (!booking) {
    return res.status(404).json({ error: 'Bokning hittades inte' })
  }

  // Om bokningen hittades, skicka tillbaka den
  res.json(booking)
})

// GET /api/health - Health check endpoint
// Detta används för att kolla om servern fungerar
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Starta servern och lyssna på porten
app.listen(PORT, () => {
  console.log(`🚀 Server körs på http://localhost:${PORT}`)
})
