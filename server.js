const https = require('https');
const TOKEN = "skycastle%20panel_authtoken_d1ba2e21a9b5610c3a694803bdf51483";

function afk() {
  const options = {
    hostname: 'panel.skycastle.us',
    path: '/api/user/billingafk/work',
    method: 'POST',
    headers: {
      'Cookie': `panel_authtoken_d1ba2e21a9b5610c3a694803bdf51483=${TOKEN}`,
      'Accept': 'application/json'
    }
  };
  const req = https.request(options, res => res.on('data', () => {}));
  req.on('error', () => {});
  req.end();
}

setInterval(afk, 300000);
afk();

require('http').createServer((q, s) => s.end('alive'))
  .listen(process.env.PORT);   
