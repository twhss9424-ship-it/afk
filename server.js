const https = require('https');
const http = require('http');
const TOKEN = "skycastle%20panel_authtoken_d1ba2e21a9b5610c3a694803bdf51483";

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
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => console.log('AFK:', data.slice(0, 100)));
  });
  req.on('error', e => console.log('Err:', e.message));
  req.end();
}

// On startup: send 5 rapid heartbeats to re-activate AFK instantly
for (let i = 0; i < 5; i++) {
  setTimeout(afk, i * 1000);
}

// Then keep it alive every 30 sec (faster = less gap on cold start)
setInterval(afk, 30000);

const server = http.createServer((q, s) => s.end('alive'));
server.listen(process.env.PORT);   
