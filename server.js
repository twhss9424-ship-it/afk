const https = require('https');
const http = require('http');
const TOKEN = "9892666821e350813005e21f6a45c5127c459619b9a928a285f6c728044e7587122048e899741690337a8705984e3a66e";
const COOKIE = `skycastle%20panel_authtoken_d1ba2e21a9b5610c3a694803bdf51483=${TOKEN}`;

function post(path) {
  const options = {
    hostname: 'panel.skycastle.us',
    path: path,
    method: 'POST',
    headers: {
      'Cookie': COOKIE,
      'Accept': 'application/json'
    }
  };
  const req = https.request(options, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => console.log(path, ':', data.slice(0, 200)));
  });
  req.on('error', e => console.log('Error:', e.message));
  req.end();
}

// Start AFK, then heartbeat every 60s
function startAFK() {
  post('/api/user/billingafk/start');
  setInterval(() => post('/api/user/billingafk/work'), 60000);
  post('/api/user/billingafk/work');
}

// Restart AFK every 8 hours (before daily limit resets)
setInterval(startAFK, 8 * 60 * 60 * 1000);
startAFK();

const server = http.createServer((q, s) => s.end('alive'));
server.listen(process.env.PORT);  
