const http = require('http');

const data = JSON.stringify({
  email: "admin@klyptocrm.com",
  password: "password123"
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login', // let's check auth controller path
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log("Login:", body);
  });
});
req.write(data);
req.end();
