# Sebnaro

Marketing site for **Sebnaro LLC** — website design & development, and Instagram marketing.
Two services, sold separately.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page — services, process, work, studio, and the lead capture form |
| `pricing.html` | Website packages (Starter / Professional / Premium) + Care & Growth plans |
| `instagram-pricing.html` | Instagram tiers (Starter / Growth / Full Service) + filming policy |

Plain static HTML. No build step, no dependencies. Every page is self-contained —
CSS and JS are inline, fonts load from Google Fonts.

## Configuration

Two values live at the top of the `<script>` block in `index.html`:

```js
var W3_KEY  = '...';   // Web3Forms access key — where form submissions are emailed
var CAL_URL = '...';   // Cal.com booking link for the "Book a call" path
```

## How the lead form works

1. Visitor fills in name, business, email, phone, and which service they want.
2. A conditional field appears — website URL for Websites, Instagram handle for
   Instagram, both for Both. Each has an "I don't have one yet" checkbox.
3. They pick one of two paths:
   - **Book a call** — details are emailed immediately, *then* the Cal.com calendar
     appears pre-filled with their answers.
   - **Ask a question** — a textarea appears; submitting emails the question.

Details are emailed *before* the calendar loads on purpose: if someone abandons the
time-picker, the lead is already captured.

Subject lines are prefixed `[BOOKING]` or `[QUESTION]` so they can be filtered.

## Deploying

Connected to Vercel. Pushes to `main` deploy automatically.

## Still to do

- [ ] Add the Cal.com booking link (`CAL_URL`)
- [ ] Point a real domain at the Vercel project
- [ ] Swap the Web3Forms delivery address to the business email
- [ ] Replace the four reserved Selected Work slots with real case studies
- [ ] Confirm founding year and service area in the masthead dateline
- [ ] Add the Instagram handle to the footer
- [ ] Set the hourly rate referenced on the Instagram pricing page

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
