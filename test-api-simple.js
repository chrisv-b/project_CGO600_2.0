// Using built-in fetch (Node.js 18+)

async function testAPI() {
    try {
        console.log('Testing API endpoints...');
        
        // Test validate endpoint
        console.log('\n1. Testing /api/validate...');
        const validateResponse = await fetch('http://localhost:3000/api/validate?code=test-123');
        console.log('Status:', validateResponse.status);
        console.log('Response:', await validateResponse.text());
        
        // Test get-firmware endpoint
        console.log('\n2. Testing /api/get-firmware...');
        const firmwareResponse = await fetch('http://localhost:3000/api/get-firmware?code=test-123');
        console.log('Status:', firmwareResponse.status);
        console.log('Response:', await firmwareResponse.text());
        
        // Test mark-used endpoint
        console.log('\n3. Testing /api/mark-used...');
        const markResponse = await fetch('http://localhost:3000/api/mark-used?code=test-123');
        console.log('Status:', markResponse.status);
        console.log('Response:', await markResponse.text());
        
    } catch (error) {
        console.error('Error testing API:', error.message);
    }
}

testAPI(); 