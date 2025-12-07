# Strajk-bowling-mountFuji
            Målet är att lära mig - Tester, cd, cdi , react, vite, docker ,
            docker compose, ngnix och Db . Helt enkelt full stack. 
Plan:
            J1: 7 Décembre 2025 -
            - Installera verktyg för testning (React Testing Library finns ofta redan)
            -Installera Mock Service Worker (MSW) - det är ett verktyg som låtsas vara en server
            -Skapa en fil som låter GitHub köra dina tester automatiskt
-Skapa src/mocks/handlers.js och src/mocks/server.js.
-Konfigurera MSW:
Mocka POST-anropet för bokning (returnera bokningsnummer + totalsumma).
React testing Lib
-npm install @testing-library/react @testing-library/jest-dom @testing-library/user-event msw --save-dev
MSW : fake server för tester istället för en riktig API
-npm install --save-dev msw 
ViteTest - verktyg 
npm install --save-dev vitest jsdom 
. Setup för GitHub Actions
Skapa .github/workflows/tests.yml.
            Lägg in workflow som:
            installerar dependencies
            kör npm test -- --coverage
Skapa filstruktur för tester
