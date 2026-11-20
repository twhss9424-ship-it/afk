const https = require('https');
const http = require('http');

const TOKEN = process.env.REMEMBER_TOKEN; // set this in Render > Environment
if (!TOKEN) {
  console.error('[FATAL] REMEMBER_TOKEN env var is not set');
  process.exit(1);
}

const HOST = 'panel.skycastle.us';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

function request(path, method, body) {
  return new Promise(resolve => {
    const headers = {
      Cookie: `remember_token=${TOKEN}`,
      Accept: 'application/json',
      'User-Agent': UA,
    };
    const payload = body ? JSON.stringify(body) : null;
    if (payload) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = https.request({ hostname: HOST, path, method, headers, timeout: 15000 }, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch {}
        resolve({ status: res.statusCode, json, raw: data });
      });
    });

    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', e => resolve({ status: 0, json: null, raw: e.message }));
    if (payload) req.write(payload);
    req.end();
  });
}

async function checkStatus() {
  const r = await request('/api/user/billingafk/status', 'GET');
  // Don't log the full body; it contains the injected ad script
  console.log(`[STATUS] http=${r.status} success=${r.json?.success} message=${r.json?.message}`);
  const d = r.json?.data;
  if (d) {
    console.log(`[STATUS] credits_per_minute=${d.credits_per_minute} interval=${d.reward_interval_seconds}s`);
  }
  return r;
}

async function afk() {
  const r = await request('/api/user/billingafk/work', 'POST', { minutes_afk: 1 });
  console.log(
    `[AFK] ${new Date().toISOString()} | http=${r.status} | success=${r.json?.success} | message=${r.json?.message ?? r.raw.slice(0, 200)}`
  );
  if (r.status === 401 || r.status === 403) {
    console.log('[AFK] Auth rejected: token is probably expired. Get a fresh remember_token.');
  }
}

async function loop() {
  await afk();
  setTimeout(loop, 61000); // chained, so requests never overlap
}

console.log(`[START] ${new Date().toISOString()}`);
checkStatus().then(loop);

http
  .createServer((q, s) => s.end('alive'))
  .listen(process.env.PORT || 10000, () =>
    console.log(`[SERVER] listening on ${process.env.PORT || 10000}`)
  );
