const https = require('https');
const http = require('http');
const TOKEN = "skycastle%20panel_authtoken_d1ba2e21a9b5610c3a694803bdf51483";

function afk() {
  try {
    const options = {
      hostname: 'panel.skycastle.us',
      path: '/api/user/billingafk/work',
      method: 'POST',
      headers: {
        'Cookie': `remember_token=${TOKEN}`,
        'Accept': 'application/json'
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`[AFK] ${new Date().toISOString()} | success: ${json.success} | credits: ${json.data?.credits || 'N/A'}`);
        } catch {
          console.log(`[AFK] ${new Date().toISOString()} | raw: ${data.slice(0, 200)}`);
        }
      });
    });
    req.on('error', e => console.log(`[ERR] ${new Date().toISOString()} | ${e.message}`));
    req.end();
  } catch (e) {
    console.log(`[ERR] ${new Date().toISOString()} | ${e.message}`);
  }
}

// Check status on startup
function checkStatus() {
  try {
    const options = {
      hostname: 'panel.skycastle.us',
      path: '/api/user/billingafk/status',
      method: 'GET',
      headers: {
        'Cookie': `remember_token=${TOKEN}`,
        'Accept': 'application/json'
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => console.log(`[STATUS] ${data.slice(0, 300)}`));
    });
    req.on('error', e => console.log(`[STATUS ERR] ${e.message}`));
    req.end();
  } catch (e) {}
}

console.log(`[START] ${new Date().toISOString()} | AFK bot running`);
checkStatus();
setInterval(afk, 60000);
afk();

const server = http.createServer((q, s) => s.end('alive'));
server.listen(process.env.PORT);   
