# Sebnaro

The marketing site for **Sebnaro LLC**, a studio that builds websites and runs marketing for local businesses.

**Live:** [sebnaro.com](https://sebnaro.com)

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page: services, process, work, studio, and the lead capture form |
| `pricing.html` | Website packages plus Care & Growth plans |
| `instagram-pricing.html` | Marketing tiers (the filename is kept so existing links keep working) |
| `card/index.html` | Digital business card at `/card`, used with an NFC tap card |
| `api/notify.js` | Vercel serverless function that pings the team on Telegram when a lead comes in |

Plain static HTML, CSS and JavaScript. No framework, no build step.

## How the lead form works

1. The visitor fills in name, business, email, phone, and which service they want.
2. A conditional field appears: website URL, Instagram handle, or both, each with an "I don't have one yet" option.
3. They pick one of two paths:
   - **Book a call:** details are emailed immediately, *then* the Cal.com calendar appears pre-filled with their answers.
   - **Ask a question:** a textarea appears, and submitting emails the question.

Details are sent *before* the calendar loads on purpose: if someone abandons the time picker, the lead is already captured. The Telegram bot token stays server-side in the Vercel function, never in the browser.

## Deploying

Connected to Vercel. Pushes to `main` deploy automatically.

## Assets

| Path | What it is |
|---|---|
| `assets/fonts.css` | The six `@font-face` rules. Every page links this. |
| `assets/rate-card.css` | Shared by `pricing.html` and `instagram-pricing.html`, which were byte-identical apart from one masthead size. |
| `fonts/*.woff2` | Self-hosted Anton, Archivo (400/600/700) and Fraunces (variable, 400-600), subset to the characters this site uses. |
| `vercel.json` | Cache headers. |

Type used to come from Google Fonts. Self-hosting removed two third-party DNS + TLS
handshakes and a render-blocking stylesheet that had to resolve before any font could
start downloading. Same faces, 140 KB down to 111 KB.

**If you ever replace a font file, rename it.** `vercel.json` caches `/fonts/*` as
`immutable` for a year, so browsers will not re-fetch a file at the same path.

Anton ships one weight (400). Heading elements default to bold, so any rule that sets
`font-family:var(--display)` on an `h1`-`h6` must also set `font-weight:400`, otherwise
the browser fakes the bold by smearing the glyphs.

`card/index.html` keeps Anton embedded as base64 on purpose: its masthead is sized in
container units and overflows if Anton ever falls back.
