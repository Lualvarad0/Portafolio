# Cornerstone Develop — Landing

Sitio de Cornerstone Develop (marca comercial de David Alvarado): software a medida, datos y ciberseguridad. Next.js 16, TypeScript, Tailwind CSS 4, lucide-react y next-intl (ES en `/`, EN en `/en`).

## Quick Start

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your real values (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Spanish is served at `/` and English at `/en`.

---

## Configuring Integrations

All keys live in `.env.local` (copy from `.env.example`). Notification keys are read only on the server.

### EmailJS (Contact Form)

1. Create a free account at [emailjs.com](https://www.emailjs.com/)
2. Add an **Email Service** (Gmail, Outlook, etc.) → copy the **Service ID**
3. Create an **Email Template** — use these variables in the template body:

   ```
   From: {{from_name}} <{{from_email}}>
   Service requested: {{service}}
   Message: {{message}}
   ```

4. Copy the **Template ID** and your account's **Public Key** (Account → API Keys)
5. Set in `.env.local`:
   ```
   EMAILJS_PUBLIC_KEY=your_public_key
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   EMAILJS_PRIVATE_KEY=your_private_key
   ```

6. Enable API requests from non-browser applications in EmailJS **Account → Security**. If private-key authorization is enabled, provide `EMAILJS_PRIVATE_KEY`. Existing `NEXT_PUBLIC_EMAILJS_*` values are supported as a migration fallback; replace them with the server variables above and remove the public variables from the deployment.

Contact emails and WhatsApp notifications now pass through `/api/contact` before delivery. Contact and chatbot endpoints each allow **5 requests per IP every 10 minutes**, return HTTP 429 with `Retry-After`, and limit bodies to 16 KiB. The limiter is in memory per running instance: multiple serverless instances do not share counters. A shared store or hosting-level rate limit is required for a deployment-wide guarantee. IP headers must be overwritten by the trusted hosting proxy.

### CallMeBot (WhatsApp Notifications)

Receive a WhatsApp message every time someone submits the contact form or the chatbot captures a lead. The key is only read server-side (`lib/notify.ts`) — never prefix it with `NEXT_PUBLIC_`.

1. Add **+34 644 64 21 56** to your WhatsApp contacts as "CallMeBot"
2. Send: `I allow callmebot to send me messages`
3. You'll receive your API key by WhatsApp
4. Set in `.env.local`:
   ```
   CALLMEBOT_PHONE=593912345678   # your number with country code
   CALLMEBOT_APIKEY=your_api_key
   ```

### Calendly

1. Create a free event at [calendly.com](https://calendly.com/)
2. Copy the scheduling link (e.g. `https://calendly.com/yourname/30min`)
3. Set in `.env.local`:
   ```
   NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/yourname/30min
   ```

---

## Deploying to Netlify

1. Push this repo to GitHub
2. In Netlify → **Add new site** → **Import from Git** → select your repo
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. Add all `NEXT_PUBLIC_*` environment variables under **Site settings → Environment variables**
5. Install the [Netlify Next.js plugin](https://github.com/netlify/netlify-plugin-nextjs) (usually auto-detected)
6. Deploy!

> **Note**: For static export (`output: 'export'`), remove `next-intl` middleware and use static locale detection instead. The default setup uses server-side middleware which requires a Node.js runtime.

---

## Project Structure

```
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx            — html/body, fonts (next/font), metadata, JSON-LD
│   │   ├── page.tsx              — home: hero + sections
│   │   ├── privacy/page.tsx      — /privacidad · /en/privacy
│   │   └── opengraph-image.tsx   — social preview image per locale
│   ├── api/                      — /api/contact and /api/chat/notify (validated, rate limited)
│   ├── icon.svg                  — favicon (Cornerstone mark)
│   └── globals.css               — brand tokens (@theme) + hero/scroll animations
├── components/
│   ├── Hero.tsx                  — video hero with cursor spotlight (SPOTLIGHT_R)
│   ├── Backdrops.tsx             — canvas fallbacks + LayerVideo (desktop and mobile; respects Save-Data and reduced motion)
│   ├── Sections.tsx              — Servicios, Desarrollo, Datos, Ciberseguridad, Proyectos, Proceso
│   ├── Contact.tsx · Footer.tsx · Navbar.tsx · Chatbot.tsx · Logo.tsx · ui.tsx
├── lib/
│   ├── brand.ts                  — brand name, contact email, WhatsApp, video paths
│   ├── projects.ts               — deployed projects (texts live in messages/*.json)
│   ├── code-samples.ts           — C# and SQL snippets shown on the page
│   ├── legal/privacy.ts          — privacy policy content (ES/EN)
│   └── notify.ts · api-guard.ts · schemas.ts · site.ts · config.ts
├── messages/                     — es.json / en.json (all page copy)
├── public/brand · public/videos  — logo files and self-hosted hero videos (Mixkit licence)
└── proxy.ts                      — next-intl locale routing
```

## Customizing Content

- **Projects**: edit `lib/projects.ts` (links/stack) and `projects.items` in `messages/*.json` (texts)
- **Translations**: edit `messages/en.json` and `messages/es.json`
- **Colors/fonts**: edit `app/globals.css` `@theme` block
- **Contact data**: edit `lib/brand.ts`
