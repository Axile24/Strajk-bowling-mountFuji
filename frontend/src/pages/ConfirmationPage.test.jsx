import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ConfirmationPage from './ConfirmationPage'

// Helper function för att rendera komponenten med router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ConfirmationPage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  describe('User Story 5: Navigera mellan bokning och bekräftelse', () => {
    // Acceptanskriterier för G:
    // - Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar
    // - Om användaren navigerar till bekräftelsevyn och ingen bokning är gjord eller finns i session storage ska texten "Ingen bokning gjord visas"
    // - Om användaren navigerar till bekräftelsevyn och det finns en bokning sparad i session storage ska denna visas

    // Testar: Om användaren navigerar till bekräftelsevyn och ingen bokning är gjord eller finns i session storage ska texten "Ingen bokning gjord visas"
    it('ska visa "Ingen bokning gjord" när ingen bokning finns i session storage', () => {
      renderWithRouter(<ConfirmationPage />)
      
      expect(screen.getByTestId('no-booking-message')).toBeInTheDocument()
      expect(screen.getByText('Ingen bokning gjord')).toBeInTheDocument()
    })

    // Testar: Om användaren navigerar till bekräftelsevyn och det finns en bokning sparad i session storage ska denna visas
    // Testar: Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd
    it('ska visa bokningsinformation när bokning finns i session storage', () => {
      const mockBooking = {
        bookingNumber: 'STR1001',
        date: '2024-12-25',
        time: '14:00',
        players: [1, 2],
        lanes: 1,
        shoeSizes: [],
        totalPrice: 340
      }
      
      sessionStorage.setItem('booking', JSON.stringify(mockBooking))
      
      renderWithRouter(<ConfirmationPage />)
      
      expect(screen.getByTestId('confirmation-card')).toBeInTheDocument()
      expect(screen.getByTestId('booking-number')).toHaveTextContent('STR1001')
    })

    // Testar: Om användaren navigerar till bekräftelsevyn och det finns en bokning sparad i session storage ska denna visas
    it('ska visa bokningsdetaljer korrekt', () => {
      const mockBooking = {
        bookingNumber: 'STR1001',
        date: '2024-12-25',
        time: '14:00',
        players: [1, 2],
        lanes: 1,
        shoeSizes: [],
        totalPrice: 340
      }
      
      sessionStorage.setItem('booking', JSON.stringify(mockBooking))
      
      renderWithRouter(<ConfirmationPage />)
      
      expect(screen.getByText('2024-12-25')).toBeInTheDocument()
      expect(screen.getByText('14:00')).toBeInTheDocument()
      // Text är uppdelad i flera element, kontrollera att texten finns i dokumentet
      expect(screen.getByText(/Antal spelare:/)).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText(/Antal banor:/)).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    // Testar: Systemet ska visa en översikt där användaren kan kontrollera de valda skostorlekarna för varje spelare innan bokningen slutförs (User Story 2)
    it('ska visa skostorlekar om de finns', () => {
      const mockBooking = {
        bookingNumber: 'STR1001',
        date: '2024-12-25',
        time: '14:00',
        players: [1, 2],
        lanes: 1,
        shoeSizes: [
          { player: 1, size: 40 },
          { player: 2, size: 42 }
        ],
        totalPrice: 340
      }
      
      sessionStorage.setItem('booking', JSON.stringify(mockBooking))
      
      renderWithRouter(<ConfirmationPage />)
      
      expect(screen.getByTestId('shoe-size-display-1')).toBeInTheDocument()
      expect(screen.getByTestId('shoe-size-display-2')).toBeInTheDocument()
      expect(screen.getByText(/Spelare 1: Storlek 40/)).toBeInTheDocument()
      expect(screen.getByText(/Spelare 2: Storlek 42/)).toBeInTheDocument()
    })

    // Testar: Den totala summan ska visas tydligt på bekräftelsesidan och inkludera en uppdelning mellan spelare och banor
    it('ska visa kostnadsuppdelning korrekt', () => {
      const mockBooking = {
        bookingNumber: 'STR1001',
        date: '2024-12-25',
        time: '14:00',
        players: [1, 2],
        lanes: 1,
        shoeSizes: [],
        totalPrice: 340
      }
      
      sessionStorage.setItem('booking', JSON.stringify(mockBooking))
      
      renderWithRouter(<ConfirmationPage />)
      
      expect(screen.getByTestId('cost-breakdown')).toBeInTheDocument()
      // Text är uppdelad i flera element, kontrollera att delarna finns
      expect(screen.getByText(/Spelare/)).toBeInTheDocument()
      // Använd getAllByText och ta första matchningen
      const costElements = screen.getAllByText(/240|100/)
      expect(costElements.length).toBeGreaterThan(0)
      expect(screen.getByText(/Banor/)).toBeInTheDocument()
    })

    // Testar: Systemet ska beräkna och visa den totala summan för bokningen baserat på antalet spelare (120 kr per person) samt antalet reserverade banor (100 kr per bana)
    // Testar: Den totala summan ska visas tydligt på bekräftelsesidan och inkludera en uppdelning mellan spelare och banor
    it('ska visa total kostnad korrekt', () => {
      const mockBooking = {
        bookingNumber: 'STR1001',
        date: '2024-12-25',
        time: '14:00',
        players: [1, 2],
        lanes: 1,
        shoeSizes: [],
        totalPrice: 340
      }
      
      sessionStorage.setItem('booking', JSON.stringify(mockBooking))
      
      renderWithRouter(<ConfirmationPage />)
      
      expect(screen.getByTestId('total-cost')).toBeInTheDocument()
      expect(screen.getByText(/Totalt: 340 kr/)).toBeInTheDocument()
    })
  })
})

