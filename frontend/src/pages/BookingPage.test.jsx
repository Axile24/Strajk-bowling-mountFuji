import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import BookingPage from './BookingPage'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Helper function för att rendera komponenten med router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('BookingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    sessionStorage.clear()
  })

  describe('User Story 1: Boka datum, tid och antal spelare', () => {
    // Acceptanskriterier för G:
    // - Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem
    // - Användaren ska kunna ange antal spelare (minst 1 spelare)
    // - Användaren ska kunna reservera ett eller flera banor beroende på antal spelare

    // Testar: Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem
    // Testar: Användaren ska kunna ange antal spelare (minst 1 spelare)
    it('ska visa formulär med datum, tid och antal spelare fält', () => {
      renderWithRouter(<BookingPage />)
      
      expect(screen.getByTestId('date-input')).toBeInTheDocument()
      expect(screen.getByTestId('time-input')).toBeInTheDocument()
      expect(screen.getByTestId('players-input')).toBeInTheDocument()
    })

    // Testar: Användaren ska kunna välja ett datum från ett kalender- och tidvalssystem
    it('ska kunna välja datum', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      // Använd framtida datum
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const dateString = futureDate.toISOString().split('T')[0]
      
      const dateInput = screen.getByTestId('date-input')
      await user.clear(dateInput)
      await user.type(dateInput, dateString)
      
      expect(dateInput).toHaveValue(dateString)
    })

    // Testar: Användaren ska kunna välja en tid från ett kalender- och tidvalssystem
    it('ska kunna välja tid', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      const timeInput = screen.getByTestId('time-input')
      await user.type(timeInput, '14:00')
      
      expect(timeInput).toHaveValue('14:00')
    })

    // Testar: Användaren ska kunna ange antal spelare (minst 1 spelare)
    it('ska kunna ange antal spelare', async () => {
      renderWithRouter(<BookingPage />)
      
      const playersInput = screen.getByTestId('players-input')
      // Använd fireEvent för att sätta värdet direkt
      fireEvent.change(playersInput, { target: { value: '3' } })
      
      // Vänta på att värdet är uppdaterat
      await waitFor(() => {
        expect(Number(playersInput.value)).toBe(3)
      })
    })

    // Testar: Användaren ska kunna reservera ett eller flera banor beroende på antal spelare
    it('ska visa antal banor baserat på antal spelare (1 bana per 4 spelare)', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      const playersInput = screen.getByTestId('players-input')
      
      // 1-4 spelare = 1 bana
      await user.click(playersInput)
      await user.keyboard('{Control>}a{/Control}')
      await user.type(playersInput, '4')
      // Vänta på att texten uppdateras
      await waitFor(() => {
        const helpTexts = screen.getAllByText((content, element) => {
          return element?.textContent?.includes('Antal banor som bokas:') && 
                 element?.textContent?.includes('1')
        })
        expect(helpTexts.length).toBeGreaterThan(0)
      })
      
      // 5-8 spelare = 2 banor
      await user.click(playersInput)
      await user.keyboard('{Control>}a{/Control}')
      await user.type(playersInput, '8')
      await waitFor(() => {
        const helpTexts = screen.getAllByText((content, element) => {
          return element?.textContent?.includes('Antal banor som bokas:') && 
                 element?.textContent?.includes('2')
        })
        expect(helpTexts.length).toBeGreaterThan(0)
      })
    })
  })

  describe('User Story 2: Välja skostorlek för varje spelare', () => {
    // Acceptanskriterier för G:
    // - Användaren ska kunna ange skostorlek för varje spelare
    // - Användaren ska kunna ändra skostorlek för varje spelare
    // - Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen

    // Testar: Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen
    it('ska visa skostorleksfält för varje spelare', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      const playersInput = screen.getByTestId('players-input')
      await user.clear(playersInput)
      await user.type(playersInput, '2')
      
      expect(screen.getByTestId('shoe-size-input-1')).toBeInTheDocument()
      expect(screen.getByTestId('shoe-size-input-2')).toBeInTheDocument()
    })

    // Testar: Användaren ska kunna ange skostorlek för varje spelare
    it('ska kunna ange skostorlek för en spelare', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      const shoeInput = screen.getByTestId('shoe-size-input-1')
      await user.type(shoeInput, '42')
      
      expect(shoeInput).toHaveValue(42)
    })

    // Testar: Användaren ska kunna ändra skostorlek för varje spelare
    it('ska kunna ändra skostorlek för en spelare', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      const shoeInput = screen.getByTestId('shoe-size-input-1')
      await user.type(shoeInput, '42')
      await user.clear(shoeInput)
      await user.type(shoeInput, '43')
      
      expect(shoeInput).toHaveValue(43)
    })

    // Testar: Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen
    it('ska kunna ange skostorlek för alla spelare', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      const playersInput = screen.getByTestId('players-input')
      await user.clear(playersInput)
      await user.type(playersInput, '3')
      
      const shoeInput1 = screen.getByTestId('shoe-size-input-1')
      const shoeInput2 = screen.getByTestId('shoe-size-input-2')
      const shoeInput3 = screen.getByTestId('shoe-size-input-3')
      
      await user.type(shoeInput1, '40')
      await user.type(shoeInput2, '42')
      await user.type(shoeInput3, '44')
      
      expect(shoeInput1).toHaveValue(40)
      expect(shoeInput2).toHaveValue(42)
      expect(shoeInput3).toHaveValue(44)
    })
  })

  describe('User Story 3: Ta bort skostorleksfält', () => {
    // Acceptanskriterier för G:
    // - Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare
    // - När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen så att inga skor längre är bokade för den spelaren
    // - Om användaren tar bort skostorleken ska systemet inte inkludera den spelaren i skorantalet och priset för skor i den totala bokningssumman

    // Testar: Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare
    it('ska visa "-"-knapp när en skostorlek är angiven', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      const shoeInput = screen.getByTestId('shoe-size-input-1')
      await user.type(shoeInput, '42')
      
      expect(screen.getByTestId('remove-shoe-1')).toBeInTheDocument()
    })

    // Testar: Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare
    // Testar: När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen så att inga skor längre är bokade för den spelaren
    it('ska kunna ta bort skostorlek genom att klicka på "-"-knappen', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      const shoeInput = screen.getByTestId('shoe-size-input-1')
      await user.type(shoeInput, '42')
      
      const removeButton = screen.getByTestId('remove-shoe-1')
      await user.click(removeButton)
      
      expect(shoeInput).toHaveValue(null)
      expect(screen.queryByTestId('remove-shoe-1')).not.toBeInTheDocument()
    })

    // Testar: När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen så att inga skor längre är bokade för den spelaren
    it('ska kunna ta bort skostorlek för flera spelare', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      const playersInput = screen.getByTestId('players-input')
      await user.clear(playersInput)
      await user.type(playersInput, '2')
      
      const shoeInput1 = screen.getByTestId('shoe-size-input-1')
      const shoeInput2 = screen.getByTestId('shoe-size-input-2')
      
      await user.type(shoeInput1, '40')
      await user.type(shoeInput2, '42')
      
      await user.click(screen.getByTestId('remove-shoe-1'))
      await user.click(screen.getByTestId('remove-shoe-2'))
      
      expect(shoeInput1).toHaveValue(null)
      expect(shoeInput2).toHaveValue(null)
    })
  })

  describe('User Story 4: Slutföra bokning med bokningsnummer och totalsumma', () => {
    // Acceptanskriterier för G:
    // - Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp
    // - Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd
    // - Systemet ska beräkna och visa den totala summan för bokningen baserat på antalet spelare (120 kr per person) samt antalet reserverade banor (100 kr per bana)
    // - Den totala summan ska visas tydligt på bekräftelsesidan och inkludera en uppdelning mellan spelare och banor

    // Testar: Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp
    it('ska ha en "slutför bokning"-knapp', () => {
      renderWithRouter(<BookingPage />)
      
      expect(screen.getByTestId('submit-booking-button')).toBeInTheDocument()
      expect(screen.getByText('Slutför bokning')).toBeInTheDocument()
    })

    // Testar: Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp
    // Testar: Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar (User Story 5)
    it('ska kunna slutföra bokningen och navigera till bekräftelse', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      // Använd framtida datum för att undvika HTML5-validering
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const dateString = futureDate.toISOString().split('T')[0]
      
      // Fyll i formuläret
      const dateInput = screen.getByTestId('date-input')
      await user.clear(dateInput)
      await user.type(dateInput, dateString)
      await user.type(screen.getByTestId('time-input'), '14:00')
      
      const playersInput = screen.getByTestId('players-input')
      fireEvent.change(playersInput, { target: { value: '2' } })
      
      // Skicka formulär
      const submitButton = screen.getByTestId('submit-booking-button')
      await user.click(submitButton)
      
      // Vänta på att navigering sker (MSW kommer mocka fetch-anropet)
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/bekraftelse')
      }, { timeout: 10000 })
    })

    // Testar: Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd
    // Testar: Systemet ska beräkna och visa den totala summan för bokningen baserat på antalet spelare (120 kr per person) samt antalet reserverade banor (100 kr per bana)
    it('ska spara bokning i session storage med bokningsnummer och totalsumma', async () => {
      const user = userEvent.setup()
      renderWithRouter(<BookingPage />)
      
      // Använd framtida datum för att undvika HTML5-validering
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      const dateString = futureDate.toISOString().split('T')[0]
      
      const dateInput = screen.getByTestId('date-input')
      await user.clear(dateInput)
      await user.type(dateInput, dateString)
      await user.type(screen.getByTestId('time-input'), '14:00')
      
      const playersInput = screen.getByTestId('players-input')
      fireEvent.change(playersInput, { target: { value: '2' } })
      
      const submitButton = screen.getByTestId('submit-booking-button')
      await user.click(submitButton)
      
      // Vänta på att fetch-anropet är klart och session storage är uppdaterat
      await waitFor(() => {
        const savedBooking = sessionStorage.getItem('booking')
        expect(savedBooking).toBeTruthy()
        if (savedBooking) {
          const booking = JSON.parse(savedBooking)
          // Verifiera att bokningsnummer genereras
          expect(booking.bookingNumber).toBeTruthy()
          expect(booking.bookingNumber).toMatch(/^STR\d+$/)
          // Verifiera att totalsumma beräknas korrekt: 2 spelare × 120 kr + 1 bana × 100 kr = 340 kr
          expect(booking.totalPrice).toBe(340)
          expect(booking.date).toBe(dateString)
          expect(booking.time).toBe('14:00')
        }
      }, { timeout: 15000, interval: 200 })
    })
  })
})

