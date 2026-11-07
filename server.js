const https = require('https');
const http = require('http');

const TOKEN = "fps_85e40b6a63d1e460ed7ea27202db2449ebb31702ed8a368b5e0c743b214cafb1";

function afk() {
  try {
    const options = {
      hostname: 'panel.skycastle.us',
      path: '/api/user/billingafk/work',
      method: 'POST',
      headers: {
        'Cookie': `remember_token=${TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`[AFK] ${new Date().toISOString()} | success: ${json.success} | credits: ${json.data?.credits || json.data?.user_credits || 'N/A'}`);
        } catch {
          console.log(`[AFK] ${new Date().toISOString()} | raw: ${data.slice(0, 200)}`);
        }
      });
    });

    req.on('error', e => console.log(`[ERR] ${new Date().toISOString()} | ${e.message}`));
    
    // Send body if required
    req.write(JSON.stringify({ minutes_afk: 1 }));
    req.end();
  } catch (e) {
    console.log(`[ERR] ${new Date().toISOString()} | ${e.message}`);
  }
}

function checkStatus() {
  try {
    const options = {
      hostname: 'panel.skycastle.us',
      path: '/api/user/billingafk/status',
      method: 'GET',
      headers: {
        'Cookie': `remember_token=${TOKEN}`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => console.log(`[STATUS] ${data.slice(0, 400)}`));
    });

    req.on('error', e => console.log(`[STATUS ERR] ${e.message}`));
    req.end();
  } catch (e) {}
}

console.log(`[START] ${new Date().toISOString()} | AFK bot running`);
checkStatus();
setInterval(afk, 61000); // slightly over 60s to be safe
afk();

const server = http.createServer((q, s) => s.end('alive'));
server.listen(process.env.PORT || 10000, () => {
  console.log(`[SERVER] listening on port ${process.env.PORT || 10000}`);
});
