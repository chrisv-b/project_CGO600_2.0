const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Helper');
console.log('========================\n');

console.log('Stap 1: Firebase Project Aanmaken');
console.log('1. Ga naar https://console.firebase.google.com/');
console.log('2. Klik op "Create a project"');
console.log('3. Geef je project een naam (bijvoorbeeld "cgo600-flash")');
console.log('4. Volg de setup wizard\n');

console.log('Stap 2: Firestore Database Aanmaken');
console.log('1. In je Firebase project, ga naar "Firestore Database"');
console.log('2. Klik op "Create database"');
console.log('3. Kies "Start in test mode"');
console.log('4. Kies een locatie (bijvoorbeeld "europe-west1")\n');

console.log('Stap 3: Service Account Aanmaken');
console.log('1. Ga naar "Project settings" (tandwiel icoon)');
console.log('2. Ga naar het "Service accounts" tabblad');
console.log('3. Klik op "Generate new private key"');
console.log('4. Download het JSON bestand\n');

console.log('Stap 4: Environment Variables Instellen');
console.log('1. Open het gedownloade JSON bestand');
console.log('2. Kopieer de volgende waarden naar Vercel:\n');

console.log('Vercel Environment Variables:');
console.log('- FIREBASE_PROJECT_ID: [project_id uit JSON]');
console.log('- FIREBASE_CLIENT_EMAIL: [client_email uit JSON]');
console.log('- FIREBASE_PRIVATE_KEY: [private_key uit JSON] (met \\n voor newlines)\n');

console.log('Stap 5: Vercel Environment Variables Toevoegen');
console.log('Run deze commands:');
console.log('vercel env add FIREBASE_PROJECT_ID');
console.log('vercel env add FIREBASE_CLIENT_EMAIL');
console.log('vercel env add FIREBASE_PRIVATE_KEY\n');

console.log('Stap 6: Test Data Toevoegen');
console.log('Run: npm run generate-codes\n');

console.log('Stap 7: Deploy');
console.log('Run: vercel --prod\n');

// Check if service account file exists
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
if (fs.existsSync(serviceAccountPath)) {
    console.log('\n✅ Service account bestand gevonden!');
    try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        console.log('\n📋 Firebase Configuratie:');
        console.log(`Project ID: ${serviceAccount.project_id}`);
        console.log(`Client Email: ${serviceAccount.client_email}`);
        console.log(`Private Key: ${serviceAccount.private_key.substring(0, 50)}...`);
        
        console.log('\n🔧 Vercel Commands:');
        console.log(`vercel env add FIREBASE_PROJECT_ID ${serviceAccount.project_id}`);
        console.log(`vercel env add FIREBASE_CLIENT_EMAIL ${serviceAccount.client_email}`);
        console.log(`vercel env add FIREBASE_PRIVATE_KEY "${serviceAccount.private_key.replace(/\n/g, '\\n')}"`);
        
    } catch (error) {
        console.error('❌ Kon service account bestand niet lezen:', error.message);
    }
} else {
    console.log('\n📁 Plaats je serviceAccountKey.json bestand in de root van het project');
    console.log('   om automatisch de configuratie te genereren.\n');
} 