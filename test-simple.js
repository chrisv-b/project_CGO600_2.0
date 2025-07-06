// Simple test
async function testAPI() {
    try {
        console.log('Testing API...');
        const response = await fetch('https://project-cgo-600-dpxbgef1p-tenways-32kphs-projects.vercel.app/validate.html?code=test-123', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Response:', text);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI(); 