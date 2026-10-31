# H.AI Remote

Phone se apne PC ka status dekhein aur poora desktop chalayen.

Beacon (Node) sirf status deta hai: RDP state, LAN/Tailscale IP, uptime, installed remote tools.
Asli screen/mouse/keyboard Microsoft Remote Desktop (Windows RDP) se chalta hai — signed, antivirus-safe.

## 1. Beacon start karein (PC par)

```bash
npm run remote
```

Terminal me phone ke liye link aur 6-digit pairing code aata hai. Window khuli rakhein.

- Same Wi-Fi: `http://<LAN-IP>:4321/remote`
- Ghar se bahar: dono devices par Tailscale, phir Tailscale IP wala link

## 2. Dashboard

Admin HQ → **Remote** tab. Beacon address + pairing code daal kar Connect.

## 3. RDP on karein (one time)

Settings → System → Remote Desktop → On (Windows Pro/Enterprise).
Ya admin PowerShell:

```powershell
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name fDenyTSConnections -Value 0
Enable-NetFirewallRule -DisplayGroup 'Remote Desktop'
```

Account par password zaroori hai. Microsoft account: email + Microsoft password (PIN nahi).

## 4. Phone app

- Android: Microsoft Remote Desktop (Google Play)
- iPhone/iPad: Microsoft Remote Desktop (App Store)

App me **+ → Add PC**, address `<LAN-IP>` (port 3389 default), username + password.

## Endpoints

| Route | Kaam |
| --- | --- |
| `GET /` | Phone deck (`remote.html`) |
| `GET /api/hello` | Public health check |
| `GET /api/status` | PC status (Bearer pairing code) |
| `POST /api/lock` | PC lock (Bearer pairing code) |

`HAI_PORT` (default 4321) aur `HAI_CODE` se override kar sakte hain.

## Note

Ye tool sirf apni machine ke liye hai. Beacon LAN/Tailscale par rehta hai — public internet par port forward na karein.
6 ghalat codes par 5 minute block lagta hai.
