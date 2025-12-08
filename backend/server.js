import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors())
app.use(express.json())

// In-memory storage för enkelhet (i produktion skulle vi använda databas)
let bookings = []
let bookingCounter = 1000

// API Routes
app.post('/api/bookings', (req, res) => {
  const { date, time, players, lanes, shoeSizes } = req.body

  // Generera bokningsnummer
  const bookingNumber = `STR${bookingCounter++}`
  
  // Beräkna totalsumma
  // 120 kr per person + 100 kr per bana
  const totalPrice = (players.length * 120) + (lanes * 100)

  const booking = {
    bookingNumber,
    date,
    time,
    players,
    lanes,
    shoeSizes,
    totalPrice,
    createdAt: new Date().toISOString()
  }

  bookings.push(booking)

  res.status(201).json(booking)
})

app.get('/api/bookings/:bookingNumber', (req, res) => {
  const { bookingNumber } = req.params
  const booking = bookings.find(b => b.bookingNumber === bookingNumber)
  
  if (!booking) {
    return res.status(404).json({ error: 'Bokning hittades inte' })
  }

  res.json(booking)
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server körs på http://localhost:${PORT}`)
})

