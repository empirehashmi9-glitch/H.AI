import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.HAI_PORT || 4321);
const CODE = process.env.HAI_CODE || String(crypto.randomInt(100000, 999999));
const VERSION = '1.1.0';
const DECK_FILE = path.join(HERE, 'remote.html');

function run(cmd, args, timeout = 3500) {
  return new Promise((resolve) => {
    execFile(cmd, args, { windowsHide: true, timeout }, (err, stdout) => {
      resolve(err ? '' : String(stdout || ''));
    });
  });
}

function portOpen(port, host = '127.0.0.1', timeout = 900) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    const end = (ok) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(timeout);
    socket.once('connect', () => end(true));
    socket.once('timeout', () => end(false));
    socket.once('error', () => end(false));
    socket.connect(port, host);
  });
}

function ipList() {
  const out = [];
  for (const [name, items] of Object.entries(os.networkInterfaces())) {
    for (const item of items || []) {
      if (item.family !== 'IPv4' || item.internal) continue;
      const tailscale = /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(item.address);
      const lan = /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(item.address);
      if (tailscale || lan) out.push({ name, address: item.address, kind: tailscale ? 'tailscale' : 'lan' });
    }
  }
  return out;
}

const TOOL_PATHS = [
  { id: 'rustdesk', label: 'RustDesk', paths: ['C:\\Program Files\\RustDesk\\rustdesk.exe'] },
  { id: 'teamviewer', label: 'TeamViewer', paths: ['C:\\Program Files\\TeamViewer\\TeamViewer.exe'] },
  {
    id: 'chrome-remote-desktop',
    label: 'Chrome Remote Desktop',
    paths: ['C:\\Program Files (x86)\\Google\\Chrome Remote Desktop\\remoting_host.exe'],
  },
  { id: 'tailscale', label: 'Tailscale', paths: ['C:\\Program Files\\Tailscale\\tailscale.exe'] },
];

let cached = null;
let cachedAt = 0;

async function readStatus() {
  if (cached && Date.now() - cachedAt < 4000) return cached;

  const [rdpQuery, osQuery, rdpListening, tools] = await Promise.all([
    run('reg', ['query', 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server', '/v', 'fDenyTSConnections']),
    run('reg', ['query', 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion', '/v', 'ProductName']),
    portOpen(3389),
    Promise.all(TOOL_PATHS.map(async (tool) => ({ ...tool, installed: tool.paths.some((p) => fs.existsSync(p)) }))),
  ]);

  const disableMatch = rdpQuery.match(/fDenyTSConnections\s+REG_DWORD\s+0x([0-9a-f]+)/i);
  const deny = disableMatch ? parseInt(disableMatch[1], 16) : null;
  const product = (osQuery.match(/ProductName\s+REG_SZ\s+(.+)/i) || [])[1];

  const ips = ipList();
  const lan = ips.find((ip) => ip.kind === 'lan');

  cached = {
    version: VERSION,
    hostname: os.hostname(),
    user: os.userInfo().username,
    platform: `${os.type()} ${os.release()}`,
    os: (product || '').trim(),
    uptime: Math.round(os.uptime()),
    addresses: ips,
    rdp: {
      enabled: deny === 0,
      listening: rdpListening,
      known: deny !== null,
      port: 3389,
      lanAddress: lan ? lan.address : ips[0] ? ips[0].address : null,
    },
    tools: tools.map(({ id, label, installed }) => ({ id, label, installed })),
    time: Date.now(),
  };
  cachedAt = Date.now();
  return cached;
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  if (x.length !== y.length) return false;
  return crypto.timingSafeEqual(x, y);
}

const failures = new Map();

function allowed(ip) {
  const entry = failures.get(ip);
  if (!entry) return true;
  if (entry.until && entry.until > Date.now()) return false;
  if (entry.until && entry.until <= Date.now()) failures.delete(ip);
  return true;
}

function failed(ip) {
  const entry = failures.get(ip) || { count: 0, until: 0 };
  entry.count += 1;
  if (entry.count >= 6) {
    entry.until = Date.now() + 5 * 60 * 1000;
    entry.count = 0;
  }
  failures.set(ip, entry);
}

function authorized(req) {
  const header = req.headers.authorization || '';
  const fromHeader = header.startsWith('Bearer ') ? header.slice(7) : '';
  const url = new URL(req.url || '/', 'http://localhost');
  const fromQuery = url.searchParams.get('code') || '';
  const given = fromHeader || fromQuery;
  return given.length > 0 && safeEqual(given, CODE);
}

function send(res, status, body, type = 'application/json') {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(payload);
}

const server = http.createServer(async (req, res) => {
  const ip = req.socket.remoteAddress || 'unknown';
  const url = new URL(req.url || '/', 'http://localhost');

  if (req.method === 'OPTIONS') return send(res, 204, '');

  if (url.pathname === '/' || url.pathname === '/remote' || url.pathname === '/index.html') {
    fs.readFile(DECK_FILE, 'utf8', (err, html) => {
      if (err) return send(res, 500, { error: 'remote.html not found' });
      send(res, 200, html, 'text/html; charset=utf-8');
    });
    return;
  }

  if (url.pathname === '/api/hello') {
    return send(res, 200, { name: 'H.AI Remote Beacon', version: VERSION });
  }

  if (url.pathname === '/api/status') {
    if (!allowed(ip)) return send(res, 429, { error: 'Too many attempts. Wait 5 minutes.' });
    if (!authorized(req)) {
      failed(ip);
      return send(res, 401, { error: 'Pairing code required' });
    }
    const status = await readStatus();
    return send(res, 200, status);
  }

  if (url.pathname === '/api/lock' && req.method === 'POST') {
    if (!allowed(ip)) return send(res, 429, { error: 'Too many attempts. Wait 5 minutes.' });
    if (!authorized(req)) {
      failed(ip);
      return send(res, 401, { error: 'Pairing code required' });
    }
    execFile('rundll32.exe', ['user32.dll,LockWorkStation'], { windowsHide: true }, () => {});
    return send(res, 200, { ok: true, locked: true });
  }

  send(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = ipList();
  const lan = ips.find((ip) => ip.kind === 'lan');
  console.log('');
  console.log(`  H.AI Remote Beacon  v${VERSION}`);
  console.log('  ------------------------------------------------');
  for (const ip of ips) {
    const label = ip.kind === 'tailscale' ? 'Tailscale' : 'LAN      ';
    console.log(`  ${label}  http://${ip.address}:${PORT}/remote`);
  }
  console.log(`  Pairing code      ${CODE}`);
  console.log('  ------------------------------------------------');
  console.log('  Phone control uses Windows Remote Desktop (RDP).');
  console.log('  Enable RDP on this PC, then open the deck on your phone.');
  if (lan) console.log(`  RDP address       ${lan.address}`);
  console.log('');
});
