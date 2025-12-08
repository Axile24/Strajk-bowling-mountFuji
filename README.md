## Projektet :

En bowlingbokningsapplikation byggd med React, Vite, Node.js/Express och PostgreSQL.

## Plan : 
DAG1..................................

```bash
npm run install:all
```
2. **Starta databasen:** 
```bash
docker-compose up -d ( VIKTIGT _ VILL GÖRA Det med Virtualbox så att två serverar pratarar med varandra?)
```
3. **Starta backend:**
```bash
cd backend
npm run dev
```
4. **Starta frontend (i ny terminal):**
```bash
cd frontend
npm run dev
```
Applikationen är nu tillgänglig på `http://localhost:3000`

DAG 2..........................................
## Tester

Kör tester:
```bash
cd frontend
npm run test
```

Kör tester med coverage:
```bash
cd frontend
npm run test:coverage
```

##  CI/CD

Projektet använder GitHub Actions för CI/CD. Tester körs automatiskt vid varje push till `main`-branchen.

...............User Story 1: Boka datum, tid och antal spelare
- Välj datum och tid
- Ange antal spelare (minst 1)
- Systemet beräknar antal banor automatiskt

............User Story 2: Välja skostorlek
- Ange skostorlek för varje spelare
- Ändra skostorlek när som helst

.............User Story 3: Ta bort skostorleksfält
- Klicka på "-"-knappen för att ta bort skostorlek

..............User Story 4: Slutföra bokning
- Få bokningsnummer
- Se totalsumma (120 kr/person + 100 kr/bana)

...........User Story 5: Navigera mellan vyer
- Navigera från bokning till bekräftelse
- Se "Ingen bokning gjord" om ingen bokning finns

## Vad har jag använt? 

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Docker)
- **Testing:** Vitest + React Testing Library + MSW
- **CI/CD:** GitHub Actions

## Projektstruktur

```
strajk-bowling-mountFuji/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── pages/     # BookingPage, ConfirmationPage
│   │   └── test/      # Tester och MSW mocks
├── backend/           # Express API
│   └── server.js
├── docker-compose.yml  # PostgreSQL setup
└── .github/
    └── workflows/     # CI/CD pipelines
```

