import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Skapa MSW server för Node.js (används i tester)
export const server = setupServer(...handlers)

