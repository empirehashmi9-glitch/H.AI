import { DeployResult, GeneratedFile, GeneratedProject } from '../types/agent';

const VERCEL_API = 'https://api.vercel.com';
const SUPABASE_API = 'https://api.supabase.com';

function now(): string {
  return new Date().toISOString();
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'hai-app';
}

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function failed(message: string, logs: string[] = []): DeployResult {
  return { provider: 'vercel', status: 'failed', message, logs, at: now() };
}

async function readError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return (data?.error?.message as string) || (data?.message as string) || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status} ${res.statusText}`;
  }
}

export async function testVercelToken(token: string): Promise<{ ok: boolean; message: string }> {
  if (!token.trim()) return { ok: false, message: 'No Vercel token set.' };
  try {
    const res = await fetch(`${VERCEL_API}/v2/user`, {
      headers: { Authorization: `Bearer ${token.trim()}` },
    });
    if (!res.ok) return { ok: false, message: await readError(res) };
    const user = await res.json();
    return { ok: true, message: `Connected as ${user?.user?.username || user?.user?.email || 'Vercel user'}` };
  } catch {
    return { ok: false, message: 'Network/CORS error reaching api.vercel.com from the browser.' };
  }
}

export async function testSupabaseToken(token: string): Promise<{ ok: boolean; message: string }> {
  if (!token.trim()) return { ok: false, message: 'No Supabase access token set.' };
  try {
    const res = await fetch(`${SUPABASE_API}/v1/projects`, {
      headers: { Authorization: `Bearer ${token.trim()}` },
    });
    if (!res.ok) return { ok: false, message: await readError(res) };
    const projects = await res.json();
    const count = Array.isArray(projects) ? projects.length : 0;
    return { ok: true, message: `Token valid · ${count} project(s) visible` };
  } catch {
    return { ok: false, message: 'Network/CORS error reaching api.supabase.com from the browser.' };
  }
}

/**
 * Deploys the generated self-contained web build to Vercel as a static
 * production deployment. The full React source is exportable as a ZIP for
 * git-based deploys.
 */
export async function deployToVercel(
  project: GeneratedProject,
  token: string,
  signal?: AbortSignal,
): Promise<DeployResult> {
  const logs: string[] = [`[${new Date().toLocaleTimeString()}] Preparing static bundle`];
  if (!token.trim()) {
    return {
      provider: 'vercel',
      status: 'needs_credentials',
      message: 'Add a Vercel token in Settings to publish live.',
      logs: [...logs, 'No VERCEL_TOKEN configured — skipped live publish.'],
      at: now(),
    };
  }
  if (!project.previewHtml || project.previewHtml.length < 200) {
    return failed('No preview bundle available for static deploy.', [...logs, 'previewHtml missing']);
  }

  const name = slugify(project.name);
  logs.push(`[${new Date().toLocaleTimeString()}] Uploading index.html (${(project.previewHtml.length / 1024).toFixed(1)} KB) → ${name}`);

  try {
    const res = await fetch(`${VERCEL_API}/v13/deployments?forceNew=1&skipAutoDetectionConfirmation=1`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      },
      signal,
      body: JSON.stringify({
        name,
        target: 'production',
        files: [{ file: 'index.html', data: toBase64(project.previewHtml) }],
        projectSettings: { framework: null },
      }),
    });

    if (!res.ok) {
      const msg = await readError(res);
      logs.push(`[error] ${msg}`);
      return failed(msg, logs);
    }

    const data = await res.json();
    const deploymentId: string = data.id;
    let url: string = data.url ? `https://${data.url}` : '';
    logs.push(`[${new Date().toLocaleTimeString()}] Deployment ${deploymentId} queued`);

    for (let i = 0; i < 12; i++) {
      if (signal?.aborted) break;
      await new Promise((r) => setTimeout(r, 2500));
      const poll = await fetch(`${VERCEL_API}/v13/deployments/${deploymentId}`, {
        headers: { Authorization: `Bearer ${token.trim()}` },
        signal,
      });
      if (!poll.ok) continue;
      const d = await poll.json();
      const state = d.readyState as string;
      logs.push(`[${new Date().toLocaleTimeString()}] readyState: ${state}`);
      if (d.url) url = `https://${d.url}`;
      if (state === 'READY') {
        return { provider: 'vercel', status: 'success', url, message: 'Live on Vercel production edge.', logs, at: now() };
      }
      if (state === 'ERROR' || state === 'CANCELED') {
        return failed(`Vercel build ${state.toLowerCase()}.`, logs);
      }
    }
    return {
      provider: 'vercel',
      status: 'success',
      url,
      message: 'Deployment accepted — Vercel is still building (check the dashboard).',
      logs,
      at: now(),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const hint = msg.toLowerCase().includes('failed to fetch')
      ? 'Browser blocked the api.vercel.com request (CORS/network). Use the exported ZIP + `vercel --prod` instead.'
      : msg;
    logs.push(`[error] ${hint}`);
    return failed(hint, logs);
  }
}

export async function runSupabaseMigration(
  project: GeneratedProject,
  token: string,
  projectRef: string,
  signal?: AbortSignal,
): Promise<DeployResult> {
  const logs: string[] = [`[${new Date().toLocaleTimeString()}] Supabase migration requested`];
  if (!token.trim() || !projectRef.trim()) {
    return {
      provider: 'supabase',
      status: 'needs_credentials',
      message: 'Add a Supabase access token + project ref in Settings to run migrations.',
      logs: [...logs, 'Missing credentials — migration skipped.'],
      at: now(),
    };
  }
  if (!/^[a-z0-9]{6,32}$/i.test(projectRef.trim())) {
    return {
      provider: 'supabase',
      status: 'failed',
      message: 'Project ref looks invalid (e.g. "abcdefghijklmnopqrst").',
      logs,
      at: now(),
    };
  }
  if (!project.supabase.databaseSql?.trim()) {
    return failed('No SQL schema was generated.', logs);
  }

  try {
    const res = await fetch(`${SUPABASE_API}/v1/projects/${projectRef.trim()}/database/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      },
      signal,
      body: JSON.stringify({ query: project.supabase.databaseSql }),
    });
    if (!res.ok) {
      const msg = await readError(res);
      logs.push(`[error] ${msg}`);
      return { provider: 'supabase', status: 'failed', message: msg, logs, at: now() };
    }
    logs.push(`[${new Date().toLocaleTimeString()}] Schema applied · ${project.supabase.tables.length} tables`);
    return {
      provider: 'supabase',
      status: 'success',
      url: `https://supabase.com/dashboard/project/${projectRef.trim()}`,
      message: 'Schema + RLS policies applied to your Supabase project.',
      logs,
      at: now(),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const hint = msg.toLowerCase().includes('failed to fetch')
      ? 'Browser blocked the api.supabase.com request (CORS/network). Paste schema.sql into the Supabase SQL editor instead.'
      : msg;
    logs.push(`[error] ${hint}`);
    return { provider: 'supabase', status: 'failed', message: hint, logs, at: now() };
  }
}

export function deployCommands(project: GeneratedProject): string[] {
  const slug = slugify(project.name);
  return [
    `# Web (React + Vite)`,
    `cd web && npm install && npm run build`,
    `npx vercel --prod --yes`,
    ``,
    `# Supabase schema`,
    `supabase link --project-ref YOUR_PROJECT_REF`,
    `supabase db push`,
    ``,
    `# Or run supabase/schema.sql directly in the SQL editor`,
    `# Preview static build: npx serve ${slug}`,
  ];
}

export function filesForVercel(project: GeneratedProject): GeneratedFile[] {
  return (project.files || []).filter((f) => f.path.startsWith('web/'));
}
