import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT = 9364;
const PROFILE = path.join(os.tmpdir(), `qoder-edge-refine-${Date.now()}`);
const OUT = 'C:/Users/pc/OneDrive/Desktop/113123/.aistudio';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const child = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, 'about:blank'], { stdio: 'ignore' });
async function json(p, init) { for (let i = 0; i < 80; i++) { try { return await (await fetch(`http://127.0.0.1:${PORT}${p}`, init)).json(); } catch { await sleep(250); } } throw new Error('no cdp'); }
await json('/json/version');
const target = await json('/json/new?about:blank', { method: 'PUT' });
const ws = new WebSocket(target.webSocketDebuggerUrl);
let seq = 0; const pending = new Map(); const errors = [];
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params?.exceptionDetails?.text || 'exception');
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
  if (m.id && pending.has(m.id)) { const { resolve, reject } = pending.get(m.id); pending.delete(m.id); m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result); }
};
await new Promise((r) => (ws.onopen = r));
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evalJs = async (expression) => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result.value; };
const shot = async (name) => { const res = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name), Buffer.from(res.data, 'base64')); };
const viewport = (w, h, m = w < 700) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: m });
const clickText = (label) => evalJs(`(() => { const b=[...document.querySelectorAll('button,a')].find(x=>(x.textContent||'').trim()===${JSON.stringify(label)} && x.getBoundingClientRect().width>0); if(b){b.click(); return true;} return false; })()`);
const clickRe = (src, flags = 'i') => evalJs(`(() => { const re=new RegExp(${JSON.stringify(src)}, ${JSON.stringify(flags)}); const b=[...document.querySelectorAll('button,a')].find(x=>re.test((x.textContent||'').trim()) && x.getBoundingClientRect().width>0); if(b){b.click(); return true;} return false; })()`);
const clickAria = (label) => evalJs(`(() => { const b=document.querySelector('button[aria-label=${JSON.stringify(label)}]'); if(b){b.click(); return true;} return false; })()`);
const setValue = (sel, value) => evalJs(`(() => { const el=document.querySelector(${JSON.stringify(sel)}); if(!el) return false; const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype; const set=Object.getOwnPropertyDescriptor(proto,'value').set; set.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event('input',{bubbles:true})); return true; })()`);
const bodyText = () => evalJs('document.body.innerText');
const waitFor = async (expr, ms = 15000) => { const end = Date.now() + ms; while (Date.now() < end) { if (await evalJs(expr)) return true; await sleep(300); } return false; };
const has = async (s) => (await bodyText()).toLowerCase().includes(s.toLowerCase());
const overflow = async (name) => console.log(' ', name, 'overflow', await evalJs('document.documentElement.scrollWidth - window.innerWidth'));
const assert = (name, ok, extra = '') => console.log(ok ? 'PASS' : 'FAIL', name, extra);
const waitTxt = (s, ms = 15000) => waitFor(`document.body.innerText.toLowerCase().includes(${JSON.stringify(s.toLowerCase())})`, ms);
const persisted = (key) => evalJs(`JSON.parse(localStorage.getItem('hai.v5.${key}')||'null')`);

await send('Page.enable'); await send('Runtime.enable');
await viewport(1440, 1050, false);
await send('Page.navigate', { url: `http://127.0.0.1:4173/?v=refine${Date.now()}` });
await sleep(2600);

assert('landing loaded', await has('H.AI'));
assert('landing mentions refine', await has('Refine any build in one sentence'));

// ---------- Studio + enhance ----------
await clickRe('Start building'); await sleep(1400);
const idea = 'Boutique clothing store with catalog, cart and admin analytics';
await setValue('textarea[placeholder*="boutique"]', idea);
await sleep(300);
await clickText('Enhance idea');
const enhanced = await waitFor(`(() => { const el=document.querySelector('textarea[placeholder*="boutique"]'); return !!el && el.value.length > 300 && el.value.toLowerCase().includes('product scope:'); })()`, 15000);
assert('enhance idea expands prompt', enhanced);
console.log('  enhanced prompt chars:', await evalJs(`document.querySelector('textarea[placeholder*="boutique"]').value.length`));
await shot('r-enhance.png');

await clickRe('Generate app');
const built = await waitFor(`(() => !!document.querySelector('[role="tablist"][aria-label="App details"]'))()`, 45000);
assert('build finished', built);
await sleep(600);

// ---------- Refine ----------
assert('refine tab exists', await clickText('Refine'));
await sleep(600);
assert('refine panel visible', await has('Ask the crew for a change'));
await overflow('detail');
await setValue('#refine-instruction', 'Make it dark and add pricing plans');
await sleep(250);
await clickText('Apply change');
const applied = await waitFor(`(() => { const t=document.body.innerText.toLowerCase(); return !t.includes('ask the crew for a change') && t.includes('rev 1'); })()`, 20000);
assert('revision applied + opened preview', applied);
await sleep(900);
await shot('r-refined-preview.png');
console.log('  header:', (await evalJs(`document.querySelector('h1').innerText`)));

await sleep(500);
const projects = await persisted('projects');
const p = Array.isArray(projects) ? projects[0] : null;
assert('project has revision log', Boolean(p?.revisions?.length === 1));
assert('preview contains refined section', Boolean(p?.previewHtml?.includes('hai-rev') && p?.previewHtml?.includes('Plans that grow')));
assert('preview marked REV 1', Boolean(p?.previewHtml?.includes('REV 1')));
assert('changelog file generated', Boolean(p?.files?.some((f) => f.path === 'CHANGELOG.md')));
assert('name kept after refine', p?.name === 'Boutique Luxe Multi-Store App', p?.name);

await clickText('Refine'); await sleep(700);
assert('revision history lists request', await has('Make it dark and add pricing plans'));
assert('revision history summary', await has('pricing plans'));
await shot('r-refine-history.png');

await clickText('Files'); await sleep(700);
assert('files tab lists changelog', await has('CHANGELOG.md'));

// ---------- Customer support escalation ----------
await clickText('Support'); await sleep(900);
await setValue('#support-message', 'I was charged twice, please refund order 12345');
await sleep(200);
await clickRe('Send to Agent #26');
assert('refund ticket escalates', await waitTxt('escalated', 12000));
await shot('r-support-escalated.png');

// ---------- Admin: task completion ----------
await clickAria('Back to worlds'); await sleep(900);
await clickRe('Open Admin HQ'); await sleep(1500);
await clickAria('Open controls for agent 1'); await sleep(1400);
await setValue('input[aria-label="Assign task to agent 1"]', 'QA audit task');
await evalJs(`(() => { const el=document.querySelector('input[aria-label="Assign task to agent 1"]'); el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); return true; })()`);
assert('task accepted', await waitTxt('synthesizing', 4000));
const delivered = await waitFor(`document.body.innerText.toLowerCase().includes('delivered')`, 20000);
assert('assigned task finishes', delivered);
await shot('r-admin-task.png');

await clickText('Support'); await sleep(1000);
assert('admin sees escalated ticket', await has('1 escalated'));
await overflow('admin-support');

// ---------- Mobile ----------
await viewport(390, 844, true); await sleep(900);
await clickAria('Back to worlds'); await sleep(900);
await clickRe('Start building'); await sleep(1100);
await clickText('My apps'); await sleep(900);
await clickText('Open'); await sleep(1200);
await clickText('Refine'); await sleep(900);
await overflow('refine');
await shot('r-mobile-refine.png');
await clickText('Preview'); await sleep(700);
await shot('r-mobile-detail.png');
await clickText('Files'); await sleep(600);
await shot('r-mobile-files.png');

console.log('errors', JSON.stringify(errors.slice(0, 10)));
try { await send('Browser.close'); } catch {}
ws.close(); spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
process.exit(0);
