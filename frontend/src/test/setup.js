import { expect, afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { server } from './mocks/server'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Starta MSW server innan alla tester
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

// Rensa efter varje test
afterEach(() => {
  cleanup()
  server.resetHandlers()
  // Rensa session storage
  sessionStorage.clear()
})

// Stäng server efter alla tester
afterAll(() => server.close())

