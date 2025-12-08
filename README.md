# 🎳 Strajk Bowling - Fullstack Webbapp

En bowlingbokningsapplikation byggd med React, Vite, Node.js/Express och PostgreSQL.

## 🚀 Kom igång

### Förutsättningar
- Node.js 20+
- Docker och Docker Compose (valfritt för databas)
- npm eller yarn

### Installation

1. **Installera beroenden:**
```bash
npm run install:all
```

2. **Starta databasen (valfritt):**
```bash
docker-compose up -d
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

## 🧪 Tester

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

## 🔄 CI/CD

Projektet använder GitHub Actions för CI/CD. Tester körs automatiskt vid varje push till `main`-branchen.

**Status**: ![Tests](https://github.com/DITT-ANVANDARNAMN/Strajk-bowling-mountFuji/workflows/Tests/badge.svg)

**⚠️ OBS**: Ersätt `DITT-ANVANDARNAMN` med ditt GitHub-användarnamn i badge-URL:en ovan!

### CI/CD Guider
- 📖 [Steg-för-steg Guide](CI_CD_STEG_FOR_STEG.md) - Detaljerad guide
- 🎯 [Praktisk Övning](CI_CD_PRAKTISK_OVNING.md) - Gör det själv
- ⚡ [Snabbstart](CI_CD_SNABBSTART.md) - 5 minuter

## 📋 User Stories

### ✅ User Story 1: Boka datum, tid och antal spelare
- Välj datum och tid
- Ange antal spelare (minst 1)
- Systemet beräknar antal banor automatiskt

### ✅ User Story 2: Välja skostorlek
- Ange skostorlek för varje spelare
- Ändra skostorlek när som helst

### ✅ User Story 3: Ta bort skostorleksfält
- Klicka på "-"-knappen för att ta bort skostorlek

### ✅ User Story 4: Slutföra bokning
- Få bokningsnummer
- Se totalsumma (120 kr/person + 100 kr/bana)

### ✅ User Story 5: Navigera mellan vyer
- Navigera från bokning till bekräftelse
- Se "Ingen bokning gjord" om ingen bokning finns

## 🏗️ Teknologier

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Docker)
- **Testing:** Vitest + React Testing Library + MSW
- **CI/CD:** GitHub Actions

## 📝 Projektstruktur

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

## 🚀 Deployment

### AWS Amplify (Rekommenderat)
- 📖 [AWS Deployment Guide](AWS_DEPLOYMENT_GUIDE.md)
- ⚡ [Quick AWS Setup](QUICK_AWS_SETUP.md)

## 📚 Dokumentation

- [CI/CD Steg-för-steg Guide](CI_CD_STEG_FOR_STEG.md)
- [CI/CD Praktisk Övning](CI_CD_PRAKTISK_OVNING.md)
- [CI/CD Snabbstart](CI_CD_SNABBSTART.md)
- [AWS Deployment Guide](AWS_DEPLOYMENT_GUIDE.md)
- [Test Checklista](TEST_CHECKLIST.md)
