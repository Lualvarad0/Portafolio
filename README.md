# David Alvarado — Portfolio / Freelance Site

Full-stack + security portfolio built with Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion, and next-intl (ES/EN).

## Quick Start

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your real values (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The middleware redirects `/` → `/en` automatically.

---

## Configuring Integrations

All keys live in `.env.local` (copy from `.env.example`). The app reads them via `lib/config.ts`.

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
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   ```

### CallMeBot (WhatsApp Notifications)

Receive a WhatsApp message every time someone submits the contact form.

1. Add **+34 644 64 21 56** to your WhatsApp contacts as "CallMeBot"
2. Send: `I allow callmebot to send me messages`
3. You'll receive your API key by WhatsApp
4. Set in `.env.local`:
   ```
   NEXT_PUBLIC_CALLMEBOT_PHONE=593912345678   # your number with country code
   NEXT_PUBLIC_CALLMEBOT_APIKEY=your_api_key
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
│   │   ├── layout.tsx     — root layout (html, body, fonts, providers)
│   │   └── page.tsx       — main page (all sections)
│   └── globals.css        — design system variables + Tailwind import
├── components/            — all UI components
├── i18n/
│   ├── routing.ts         — locale definitions
│   ├── request.ts         — server-side i18n config
│   └── navigation.ts      — typed Link/router helpers
├── lib/
│   ├── config.ts          — integration keys (reads from env)
│   ├── github.ts          — GitHub API fetch
│   └── projects.ts        — project data array
├── messages/
│   ├── en.json            — English translations
│   └── es.json            — Spanish translations
└── middleware.ts          — locale detection + redirect
```

## Customizing Content

- **Projects**: edit `lib/projects.ts`
- **Translations**: edit `messages/en.json` and `messages/es.json`
- **Colors/fonts**: edit `app/globals.css` `@theme` block
- **Social links**: update `components/Footer.tsx` and `components/Contact.tsx`
