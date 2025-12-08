# AWS Amplify Deployment Guide

## Steg 1: Förberedelser

### 1.1. Kontrollera att allt är committat
```bash
git status
git add .
git commit -m "Prepare for Amplify deployment"
git push origin dev
```

## Steg 2: Skapa AWS Amplify App

### 2.1. Gå till AWS Amplify Console
1. Logga in på [AWS Console](https://console.aws.amazon.com/)
2. Sök efter "Amplify" i sökrutan
3. Klicka på "AWS Amplify"

### 2.2. Skapa ny app
1. Klicka på "New app" → "Host web app"
2. Välj "GitHub" som källkod
3. Auktorisera GitHub om det behövs
4. Välj ditt repository: `Strajk-bowling-mountFuji`
5. Välj branch: `dev` (eller `main`)
6. Klicka på "Next"

## Steg 3: Konfigurera Build Settings

### 3.1. Amplify kommer automatiskt detektera `amplify.yml`
- Filen `amplify.yml` i root-mappen kommer användas automatiskt
- Den konfigurerar både frontend och backend

### 3.2. Om du behöver manuellt konfigurera:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --workspace=frontend
    build:
      commands:
        - npm run build --workspace=frontend
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
backend:
  phases:
    preBuild:
      commands:
        - npm ci --workspace=backend
  artifacts:
    baseDirectory: backend
    files:
      - '**/*'
```

## Steg 4: Environment Variables (Valfritt)

Om du behöver miljövariabler:
1. I Amplify Console → App settings → Environment variables
2. Lägg till:
   - `PORT=5000` (för backend)
   - Andra variabler om nödvändigt

## Steg 5: Deploy

1. Klicka på "Save and deploy"
2. Amplify kommer:
   - Installera dependencies
   - Bygga frontend
   - Förbereda backend
   - Deploya allt

## Steg 6: Backend API Setup

### 6.1. Amplify Backend Functions
Amplify kan hosta backend som serverless functions, men för enkel Express-server:

**Alternativ 1: Använd Amplify Functions (Rekommenderat)**
- Skapa en Lambda function för backend
- Konfigurera API Gateway

**Alternativ 2: Använd separat backend hosting**
- Använd AWS Elastic Beanstalk för backend
- Eller EC2 för mer kontroll

### 6.2. För nuvarande setup (Express server):
Backend behöver deployas separat eftersom Amplify primärt är för frontend + serverless functions.

## Steg 7: Uppdatera Frontend API URL

Efter deployment, uppdatera frontend för att använda rätt backend URL:

```javascript
// I frontend/src/pages/BookingPage.jsx
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : '/api'
```

## Steg 8: Verifiera Deployment

1. Öppna Amplify Console
2. Klicka på din app
3. Se deployment status
4. Öppna appen via den genererade URL:en

## Viktiga Noteringar

⚠️ **Backend Hosting:**
- Amplify är primärt för frontend + serverless functions
- För Express backend, överväg:
  - AWS Elastic Beanstalk
  - AWS EC2
  - AWS App Runner
  - Eller konvertera till serverless functions

✅ **Frontend:**
- Frontend kommer deployas perfekt på Amplify
- Automatisk HTTPS
- CDN distribution
- Automatisk CI/CD

## Troubleshooting

### Build fails
- Kontrollera att alla dependencies finns i package.json
- Se build logs i Amplify Console

### Backend inte tillgänglig
- Backend behöver deployas separat
- Eller konvertera till Amplify Functions

### CORS errors
- Kontrollera CORS-inställningar i backend
- Lägg till Amplify domain i CORS whitelist

## Ytterligare Resurser

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Amplify Full-Stack Guide](https://docs.amplify.aws/react/build-a-backend/overview/)

