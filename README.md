# CGO600 One-Time Firmware Flash Platform

Een webapplicatie waarmee gebruikers met een unieke activatiecode exact één keer aangepaste firmware kunnen flashen naar een Tenways CGO600 fiets via Web Bluetooth (DFU).

## 🎯 Functionaliteiten

- ✅ One-time activatiecode systeem
- ✅ Web Bluetooth DFU firmware flashing
- ✅ Automatische rollback naar originele firmware
- ✅ Moderne, gebruiksvriendelijke interface
- ✅ Serverless hosting op Vercel
- ✅ Firebase Firestore database

## 🏗️ Projectstructuur

```
/cgo600-flash
├── /api
│   ├── validate.js        ← controleert activatiecode
│   ├── get-firmware.js    ← serveert hack.bin alleen bij geldige code
│   ├── mark-used.js       ← markeert code als "gebruikt"
│   └── firebase-config.js ← Firebase configuratie
├── /private_firmware
│   ├── hack.bin           ← aangepaste firmware (32 km/u)
│   └── rollback.bin       ← originele firmware
├── /public
│   └── index.html         ← gebruikersinterface
├── .env                   ← Vercel: Firebase-credentials
├── package.json
├── vercel.json
└── README.md
```

## 🚀 Setup

### 1. Firebase Setup

1. Maak een nieuw Firebase project aan
2. Ga naar Project Settings > Service Accounts
3. Genereer een nieuwe private key
4. Download het JSON bestand

### 2. Vercel Environment Variables

Voeg de volgende environment variables toe in je Vercel project:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

**Let op:** Voor de `FIREBASE_PRIVATE_KEY` moet je `\n` gebruiken in plaats van echte newlines.

### 3. Firestore Database

Maak een collectie genaamd `tokens` met de volgende structuur:

```javascript
{
  "activatiecode-uuid": {
    "status": "nieuw", // "nieuw" | "in-gebruik" | "gebruikt"
    "aangemaakt_op": timestamp,
    "gebruikt_op": timestamp, // optioneel
    "voltooid_op": timestamp  // optioneel
  }
}
```

### 4. Firmware Bestanden

Vervang de placeholder bestanden in `/private_firmware/`:
- `hack.bin` - De aangepaste firmware (32 km/u)
- `rollback.bin` - De originele firmware

### 5. Deployment

```bash
# Installeer dependencies
npm install

# Deploy naar Vercel
vercel --prod
```

## 🔐 Activatiecode Systeem

### Status Flow

1. **"nieuw"** - Code is beschikbaar voor gebruik
2. **"in-gebruik"** - Flash is gestart, code is vergrendeld
3. **"gebruikt"** - Flash is voltooid, code kan niet meer gebruikt worden

### API Endpoints

#### `GET /api/validate?code=...`
- Controleert of code bestaat en status "nieuw" is
- Zet status naar "in-gebruik"
- Retourneert: `{ "status": "valid" }`

#### `GET /api/get-firmware?code=...`
- Checkt of code bestaat en status "in-gebruik" is
- Serveert hack.bin als application/octet-stream
- Retourneert 403 als code ongeldig/gebruikt is

#### `GET /api/mark-used?code=...`
- Zet status naar "gebruikt"
- Retourneert: `{ "status": "done" }`

## 💻 Gebruik

### Voor Gebruikers

1. Ga naar de webapp
2. Voer je unieke activatiecode in
3. Klik op "Start Flash"
4. Volg de Bluetooth verbindingsinstructies
5. Wacht tot het flash proces voltooid is

### Rollback

- Klik op "Herstel naar originele firmware"
- Geen activatiecode nodig
- Directe flash van originele firmware

## 🧪 Testen

### Test Cases

| Testcase | Verwacht resultaat |
|----------|-------------------|
| Geldige code invoeren | Flash start met hack.bin |
| Ongeldige code invoeren | Melding: "code ongeldig" |
| Code na flash hergebruiken | Melding: "code verlopen" |
| Rollback uitvoeren | Originele firmware wordt geladen |

### Lokale Ontwikkeling

```bash
# Start lokale development server
npm run dev

# Test API endpoints
curl "http://localhost:3000/api/validate?code=test-code"
```

## 🔧 Beheer

### Code Generatie Script

```javascript
// Voorbeeld voor het genereren van activatiecodes
const { v4: uuidv4 } = require('uuid');
const { db } = require('./api/firebase-config');

async function generateCode() {
  const code = uuidv4();
  await db.collection('tokens').doc(code).set({
    status: 'nieuw',
    aangemaakt_op: new Date()
  });
  console.log('Generated code:', code);
}
```

### Monitoring

- Alle API calls worden gelogd in Vercel logs
- Firebase Firestore bevat volledige audit trail
- IP adressen en timestamps worden opgeslagen
- Progress tracking tijdens firmware flash
- Page leave warnings tijdens flash proces

## 🛡️ Beveiliging

- Firmware bestanden zijn niet publiek toegankelijk
- Geen caching op firmware bestanden
- CORS headers geconfigureerd
- Input validatie op alle endpoints
- IP logging voor audit trail
- Rate limiting via Vercel
- Error handling voor firmware streaming

## 🌐 Browser Ondersteuning

- Chrome (desktop & Android) - Volledige ondersteuning
- Edge - Volledige ondersteuning
- Firefox - Beperkte Web Bluetooth ondersteuning
- Safari - Geen Web Bluetooth ondersteuning

## 📱 Mobile Ondersteuning

- Android Chrome - Volledig ondersteund
- iOS Safari - Niet ondersteund (geen Web Bluetooth)
- Progressive Web App (PWA) mogelijkheden

## 🔄 Updates

### Versie 1.0.0
- Initiële release
- One-time activatiecode systeem
- Web Bluetooth DFU support
- Rollback functionaliteit

## 📞 Support

Voor vragen of problemen:
1. Check de browser console voor foutmeldingen
2. Controleer Vercel logs voor server errors
3. Verifieer Firebase Firestore data

## 📄 Licentie

MIT License - zie LICENSE bestand voor details. 