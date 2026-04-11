const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/user_data/login', {
      email: 'admin@admin.com',
      password: 'admin@1234'
    });
    
    console.log('Login Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
  }
}

testLogin();
