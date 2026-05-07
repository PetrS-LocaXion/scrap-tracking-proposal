import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PASSWORD = (process.env.SITE_PASSWORD || "ForkliftSafety").trim();

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("site-auth");
  if (authCookie?.value === PASSWORD) {
    return NextResponse.next();
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Required</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #faf5ff 100%);
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 48px 44px 40px;
      box-shadow: 0 25px 60px -12px rgba(99,102,241,0.15), 0 8px 24px -4px rgba(15,23,42,0.08);
      text-align: center;
      max-width: 420px;
      width: 90%;
    }
    .lx-logo {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.04em;
      margin-bottom: 28px;
      background: linear-gradient(105deg, #0e7afe 0%, #6366f1 48%, #9333ea 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    .subtitle {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 28px;
    }
    form { display: flex; flex-direction: column; gap: 12px; }
    input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 16px;
      outline: none;
      transition: border-color 0.2s;
      text-align: center;
      letter-spacing: 0.05em;
      color: #0f172a;
    }
    input:focus { border-color: #6366f1; }
    button {
      padding: 13px 24px;
      background: linear-gradient(105deg, #0e7afe 0%, #6366f1 48%, #9333ea 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: filter 0.2s, transform 0.1s;
      letter-spacing: 0.01em;
    }
    button:hover { filter: brightness(1.08); }
    button:active { transform: scale(0.98); }
    .error {
      color: #ef4444;
      font-size: 13px;
      font-weight: 600;
      display: none;
      margin-top: 2px;
    }
    .divider {
      height: 1px;
      background: #f1f5f9;
      margin: 28px 0 24px;
    }
    .prepared-label {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #94a3b8;
      margin-bottom: 16px;
    }
    .client-logo {
      font-size: 30px;
      font-weight: 800;
      letter-spacing: 0.03em;
      color: #0f172a;
      text-transform: uppercase;
    }
    .client-logo img {
      height: 80px;
      width: auto;
      max-width: 320px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }
    .client-logo-text {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.03em;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="lx-logo">LocaXion</div>
    <h1>Password Required</h1>
    <p class="subtitle">Enter the password to access this presentation.</p>
    <form id="form">
      <input type="password" id="pw" placeholder="Enter password" autofocus />
      <div class="error" id="error">Incorrect password. Please try again.</div>
      <button type="submit">Continue</button>
    </form>
    <div class="divider"></div>
    <p class="prepared-label">Prepared for</p>
    <div class="client-logo">
      <img src="/images/arconic-logo.svg" alt="Arconic" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
      <span class="client-logo-text" style="display:none">Arconic</span>
    </div>
  </div>
  <script>
    document.getElementById('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const pw = document.getElementById('pw').value;
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        document.getElementById('error').style.display = 'block';
        document.getElementById('pw').value = '';
        document.getElementById('pw').focus();
      }
    });
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

export const config = {
  matcher: ["/", "/arconic-slides/:path*"],
};
