# ALI DEVELOPER — website (plain HTML + CSS + JS)

No build step, no npm, no Node. Upload the files to GitHub and Vercel deploys them as-is.
All files are in ONE folder (no sub-folders), so they upload easily from a phone.

## 1. Change your contact details (only file you must edit)
Open `config.js` and fill in:
- `whatsappNumber` — digits only with country code, e.g. `"919876543210"`  (**do this before launch**)
- `email` — optional
- `formEndpoint` — optional (Formspree / Web3Forms URL). Empty = forms open WhatsApp with a prefilled message; nothing is stored.
- `social` — profile links (empty ones are hidden)

On mobile: GitHub → open `config.js` → pencil icon → edit → **Commit changes**. Vercel redeploys automatically in ~30 seconds.

## 2. Upload to GitHub from your phone
1. Extract the zip on your phone (Files app).
2. GitHub → **+** → **New repository** → name it (e.g. `ali-developer`) → Public → **Create**.
3. Tap **uploading an existing file** (or Add file → Upload files).
4. Select **all files** from the extracted folder (30 files — GitHub allows up to 100 per upload) → wait until uploaded → **Commit changes**.
   Keep `index.html` at the repository root (not inside a folder).

## 3. Deploy on Vercel
1. vercel.com → **Add New → Project** → import the repository.
2. **Framework Preset: Other.** Leave Build Command and Output Directory empty → **Deploy**.
3. Vercel gives you a `*.vercel.app` link. Open it and test on your phone.

> Vercel's free Hobby plan is meant for non-commercial use. A business website may need the Pro plan — check Vercel's current terms.

## 4. Connect alideveloper.online
Vercel project → **Settings → Domains** → add `alideveloper.online` and `www.alideveloper.online`.
At your domain registrar add the DNS records Vercel shows (usually an A record for the root domain and a CNAME for `www`). HTTPS is automatic.

## 5. Google Search Console
Add the property, verify the domain (DNS or HTML-file method), then submit `https://alideveloper.online/sitemap.xml`.

## 6. Editing content later
- Text/prices/FAQ: edit the HTML file directly in GitHub (pencil icon) — e.g. prices are in `index.html` and `pricing.html`.
- New real projects / client work: duplicate a `project-*.html` file and a card in `portfolio.html`. Mark something as client work ONLY if it is genuine and authorised.
- Real testimonials: replace the "What Clients Can Expect" cards in `index.html` only with genuine reviews you have permission to publish.

## Honesty notes
- Portfolio items are labelled **Demo Project** / **Concept Design**. The Akriti Interiors card links to the live demo at akriti-interiors-xi.vercel.app.
- Pricing text says "starting prices"; hosting/domain/payment gateways are stated as separate/extra.
- Privacy Policy and Terms are general templates — have them reviewed for your situation.

## Files
`index.html about.html services.html portfolio.html pricing.html contact.html privacy.html terms.html 404.html`
`service-*.html` (8 service pages) · `project-*.html` (5 project pages)
`styles.css main.js config.js favicon.svg og.png sitemap.xml robots.txt vercel.json`
