#!/usr/bin/env node

const fetch = require('node-fetch');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing CGO600 Flash API...\n');

  // Test 1: Validate with invalid code
  console.log('1. Testing validate with invalid code...');
  try {
    const response = await fetch(`${BASE_URL}/api/validate?code=invalid-code`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 2: Get firmware with invalid code
  console.log('\n2. Testing get-firmware with invalid code...');
  try {
    const response = await fetch(`${BASE_URL}/api/get-firmware?code=invalid-code`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 3: Mark used with invalid code
  console.log('\n3. Testing mark-used with invalid code...');
  try {
    const response = await fetch(`${BASE_URL}/api/mark-used?code=invalid-code`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 4: Test rollback endpoint
  console.log('\n4. Testing rollback endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/rollback.bin`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    console.log(`   Content-Length: ${response.headers.get('content-length')}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 5: Test CORS headers
  console.log('\n5. Testing CORS headers...');
  try {
    const response = await fetch(`${BASE_URL}/api/validate?code=test`, {
      method: 'OPTIONS'
    });
    console.log(`   Status: ${response.status}`);
    console.log(`   Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
    console.log(`   Access-Control-Allow-Methods: ${response.headers.get('access-control-allow-methods')}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n✅ API tests completed!');
}

// Run tests
testAPI().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
}); 