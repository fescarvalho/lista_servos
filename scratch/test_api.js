const fetch = require('node-fetch');

async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/pessoas');
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Data fetched:', data.length, 'records');
      if (data.length > 0) {
        console.log('Example record:', data[0]);
      }
    } else {
      console.error('Failed to fetch:', response.status);
    }
  } catch (error) {
    console.error('Error connecting to dev server:', error.message);
    console.log('Make sure "npm run dev" is running at http://localhost:3000');
  }
}

testAPI();
