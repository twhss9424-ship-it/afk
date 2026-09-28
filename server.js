const https = require('https');
const http = require('http');
const TOKEN = "9892666821e350813005e21f6a45c5127c459619b9a928a285f6c728044e7587122048e899741690337a8705984e3a66e";

function afk() {
  const options = {
    hostname: 'panel.skycastle.us',
    path: '/api/user/billingafk/work',
    method: 'POST',
    headers: {
      'Cookie': `skycastle%20panel_authtoken_d1ba2e21a9b5610c3a694803bdf51483=${TOKEN}`,
      'Accept': 'application/json'
    }
  };
  const req = https.request(options, res => {
    res.on('data', () => {});
    res.on('end', () => {});
  });
  req.on('error', () => {});
  req.end();
}

setInterval(afk, 300000);
afk();

const server = http.createServer((req, res) => res.end('alive'));
server.listen(process.env.PORT);
