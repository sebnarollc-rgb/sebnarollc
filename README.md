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
