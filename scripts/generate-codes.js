#!/usr/bin/env node

const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();

async function generateCode() {
  const code = uuidv4();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  
  try {
    // Check if code already exists (extremely unlikely but good practice)
    const existingDoc = await db.collection('tokens').doc(code).get();
    if (existingDoc.exists) {
      console.warn(`⚠️  Code ${code} already exists, generating new one...`);
      return await generateCode(); // Recursive call to generate new code
    }

    await db.collection('tokens').doc(code).set({
      status: 'nieuw',
      aangemaakt_op: timestamp
    });
    
    console.log(`✅ Generated activation code: ${code}`);
    return code;
  } catch (error) {
    console.error('❌ Error generating code:', error);
    return null;
  }
}

async function generateMultipleCodes(count = 1) {
  console.log(`🔄 Generating ${count} activation code(s)...`);
  
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = await generateCode();
    if (code) {
      codes.push(code);
    }
  }
  
  console.log(`\n📋 Generated ${codes.length} code(s):`);
  codes.forEach((code, index) => {
    console.log(`${index + 1}. ${code}`);
  });
  
  return codes;
}

async function listCodes() {
  try {
    const snapshot = await db.collection('tokens').get();
    
    if (snapshot.empty) {
      console.log('📭 No activation codes found');
      return;
    }
    
    console.log(`📋 Found ${snapshot.size} activation code(s):\n`);
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const status = data.status;
      const created = data.aangemaakt_op?.toDate?.() || 'Unknown';
      const used = data.gebruikt_op?.toDate?.() || 'Not used';
      const completed = data.voltooid_op?.toDate?.() || 'Not completed';
      
      console.log(`Code: ${doc.id}`);
      console.log(`Status: ${status}`);
      console.log(`Created: ${created}`);
      console.log(`Started: ${used}`);
      console.log(`Completed: ${completed}`);
      console.log('---');
    });
  } catch (error) {
    console.error('❌ Error listing codes:', error);
  }
}

async function resetCode(code) {
  if (!code) {
    console.error('❌ Please provide a code to reset');
    return;
  }
  
  try {
    await db.collection('tokens').doc(code).update({
      status: 'nieuw',
      gebruikt_op: null,
      voltooid_op: null
    });
    
    console.log(`✅ Reset code ${code} to 'nieuw' status`);
  } catch (error) {
    console.error('❌ Error resetting code:', error);
  }
}

async function deleteCode(code) {
  if (!code) {
    console.error('❌ Please provide a code to delete');
    return;
  }
  
  try {
    await db.collection('tokens').doc(code).delete();
    console.log(`✅ Deleted code ${code}`);
  } catch (error) {
    console.error('❌ Error deleting code:', error);
  }
}

async function getStats() {
  try {
    const snapshot = await db.collection('tokens').get();
    
    const stats = {
      total: 0,
      nieuw: 0,
      'in-gebruik': 0,
      gebruikt: 0
    };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      stats.total++;
      stats[data.status] = (stats[data.status] || 0) + 1;
    });
    
    console.log('📊 Activation Code Statistics:');
    console.log(`Total codes: ${stats.total}`);
    console.log(`New: ${stats.nieuw}`);
    console.log(`In use: ${stats['in-gebruik']}`);
    console.log(`Used: ${stats.gebruikt}`);
  } catch (error) {
    console.error('❌ Error getting stats:', error);
  }
}

// CLI argument parsing
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'generate':
    const count = parseInt(args[1]) || 1;
    generateMultipleCodes(count).then(() => process.exit(0));
    break;
    
  case 'list':
    listCodes().then(() => process.exit(0));
    break;
    
  case 'reset':
    const resetCodeArg = args[1];
    resetCode(resetCodeArg).then(() => process.exit(0));
    break;
    
  case 'delete':
    const deleteCodeArg = args[1];
    deleteCode(deleteCodeArg).then(() => process.exit(0));
    break;
    
  case 'stats':
    getStats().then(() => process.exit(0));
    break;
    
  default:
    console.log(`
🚲 CGO600 Activation Code Manager

Usage:
  node generate-codes.js <command> [options]

Commands:
  generate [count]    Generate one or more activation codes
  list               List all activation codes
  reset <code>       Reset a code to 'nieuw' status
  delete <code>      Delete an activation code
  stats              Show statistics

Examples:
  node generate-codes.js generate 5
  node generate-codes.js list
  node generate-codes.js reset abc123-def456
  node generate-codes.js delete abc123-def456
  node generate-codes.js stats
    `);
    process.exit(1);
} 