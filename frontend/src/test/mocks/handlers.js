import { http, HttpResponse } from 'msw'

// Mock handlers för API-anrop
export const handlers = [
  // POST /api/bookings - Skapa ny bokning
  http.post('/api/bookings', async ({ request }) => {
    const body = await request.json()
    
    // Generera bokningsnummer
    const bookingNumber = `STR${1000 + Math.floor(Math.random() * 1000)}`
    
    // Beräkna totalsumma
    const playerCount = body.players?.length || 0
    const laneCount = body.lanes || 1
    const totalPrice = (playerCount * 120) + (laneCount * 100)

    const booking = {
      bookingNumber,
      date: body.date,
      time: body.time,
      players: body.players || [],
      lanes: body.lanes || 1,
      shoeSizes: body.shoeSizes || [],
      totalPrice,
      createdAt: new Date().toISOString()
    }

    return HttpResponse.json(booking, { status: 201 })
  }),

  // GET /api/bookings/:bookingNumber
  http.get('/api/bookings/:bookingNumber', ({ params }) => {
    const { bookingNumber } = params
    
    // Mock response
    return HttpResponse.json({
      bookingNumber,
      date: '2024-12-25',
      time: '14:00',
      players: [1, 2],
      lanes: 1,
      shoeSizes: [],
      totalPrice: 340,
      createdAt: new Date().toISOString()
    })
  }),
]

