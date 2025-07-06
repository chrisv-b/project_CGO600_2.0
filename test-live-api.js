// Test the live API
async function testLiveAPI() {
    const baseUrl = 'https://project-cgo-600-7c4q8j2hx-tenways-32kphs-projects.vercel.app';
    
    try {
        console.log('Testing live API endpoints...');
        
        // Test validate endpoint
        console.log('\n1. Testing /api/validate...');
        const validateResponse = await fetch(`${baseUrl}/api/validate?code=test-123`);
        console.log('Status:', validateResponse.status);
        const validateText = await validateResponse.text();
        console.log('Response:', validateText);
        
        // Test get-firmware endpoint
        console.log('\n2. Testing /api/get-firmware...');
        const firmwareResponse = await fetch(`${baseUrl}/api/get-firmware?code=test-123`);
        console.log('Status:', firmwareResponse.status);
        const firmwareText = await firmwareResponse.text();
        console.log('Response:', firmwareText);
        
        // Test mark-used endpoint
        console.log('\n3. Testing /api/mark-used...');
        const markResponse = await fetch(`${baseUrl}/api/mark-used?code=test-123`);
        console.log('Status:', markResponse.status);
        const markText = await markResponse.text();
        console.log('Response:', markText);
        
    } catch (error) {
        console.error('Error testing live API:', error.message);
    }
}

testLiveAPI(); 