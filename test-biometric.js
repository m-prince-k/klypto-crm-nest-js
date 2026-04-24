const axios = require('axios');

async function testBiometricPush() {
  const url = 'http://localhost:3000/api/iclock/cdata?SN=K90PRO123&table=ATTLOG';
  // Example ADMS ATTLOG row format: userId \t timestamp \t status \t punchType \t ...
  const rawData = 'EMP - 001\t2026-04-22 08:30:00\t0\t1\t0\t0\nEMP - 001\t2026-04-22 17:30:00\t1\t1\t0\t0';

  console.log('Sending mock biometric push...');
  try {
    const response = await axios.post(url, rawData, {
      headers: { 'Content-Type': 'text/plain' }
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testBiometricPush();
