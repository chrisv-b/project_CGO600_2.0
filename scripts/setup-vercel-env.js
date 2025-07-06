const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Vercel Environment Variables Setup');
console.log('=====================================\n');

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.log('❌ serviceAccountKey.json niet gevonden!');
    console.log('📁 Plaats je Firebase service account JSON bestand in de root van het project.');
    console.log('   Download het bestand van Firebase Console > Project Settings > Service Accounts');
    process.exit(1);
}

try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    console.log('✅ Service account bestand geladen');
    console.log(`📋 Project ID: ${serviceAccount.project_id}`);
    console.log(`📧 Client Email: ${serviceAccount.client_email}`);
    console.log(`🔑 Private Key: ${serviceAccount.private_key.substring(0, 50)}...\n`);
    
    console.log('🚀 Environment variables toevoegen aan Vercel...\n');
    
    // Add FIREBASE_PROJECT_ID
    console.log('1. FIREBASE_PROJECT_ID toevoegen...');
    try {
        execSync(`vercel env add FIREBASE_PROJECT_ID ${serviceAccount.project_id}`, { stdio: 'inherit' });
        console.log('✅ FIREBASE_PROJECT_ID toegevoegd\n');
    } catch (error) {
        console.log('⚠️  FIREBASE_PROJECT_ID kon niet worden toegevoegd (mogelijk al bestaand)\n');
    }
    
    // Add FIREBASE_CLIENT_EMAIL
    console.log('2. FIREBASE_CLIENT_EMAIL toevoegen...');
    try {
        execSync(`vercel env add FIREBASE_CLIENT_EMAIL ${serviceAccount.client_email}`, { stdio: 'inherit' });
        console.log('✅ FIREBASE_CLIENT_EMAIL toegevoegd\n');
    } catch (error) {
        console.log('⚠️  FIREBASE_CLIENT_EMAIL kon niet worden toegevoegd (mogelijk al bestaand)\n');
    }
    
    // Add FIREBASE_PRIVATE_KEY
    console.log('3. FIREBASE_PRIVATE_KEY toevoegen...');
    const privateKey = serviceAccount.private_key.replace(/\n/g, '\\n');
    try {
        execSync(`vercel env add FIREBASE_PRIVATE_KEY "${privateKey}"`, { stdio: 'inherit' });
        console.log('✅ FIREBASE_PRIVATE_KEY toegevoegd\n');
    } catch (error) {
        console.log('⚠️  FIREBASE_PRIVATE_KEY kon niet worden toegevoegd (mogelijk al bestaand)\n');
    }
    
    console.log('🎉 Firebase environment variables setup voltooid!');
    console.log('\n📝 Volgende stappen:');
    console.log('1. Run: npm run generate-codes');
    console.log('2. Run: vercel --prod');
    console.log('3. Test de app met een gegenereerde activatiecode');
    
} catch (error) {
    console.error('❌ Fout bij het lezen van service account bestand:', error.message);
    process.exit(1);
} 