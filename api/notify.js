/**
 * POST /api/notify
 *
 * Sends a Telegram message to the Sebnaro group when someone submits a question
 * on the website. Runs on Vercel, so the bot token never reaches the browser.
 *
 * Environment variables (set these in Vercel → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN   from @BotFather, looks like 8123456789:AA...
 *   TELEGRAM_CHAT_ID     the group's id, a negative number like -1001234567890
 *
 * Both must be added to Production (and Preview, if you want alerts from previews).
 */

const TELEGRAM_API = 'https://api.telegram.org';

// Keep any single field from blowing up the message.
function clip(value, max) {
  const text = String(value == null ? '' : value).trim();
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

// Telegram's HTML parse mode only needs these three escaped.
function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildMessage(d) {
  const lines = [];
  lines.push('<b>New question — sebnaro.com</b>');
  lines.push('');
  if (d.name)     lines.push('<b>Name:</b> '     + esc(d.name));
  if (d.business) lines.push('<b>Business:</b> ' + esc(d.business));
  if (d.phone)    lines.push('<b>Phone:</b> '    + esc(d.phone));
  if (d.email)    lines.push('<b>Email:</b> '    + esc(d.email));
  if (d.service)  lines.push('<b>Wants:</b> '    + esc(d.service));
  if (d.website)  lines.push('<b>Site:</b> '     + esc(d.website));
  if (d.instagram)lines.push('<b>Handle:</b> '+ esc(d.instagram));
  if (d.message) {
    lines.push('');
    lines.push(esc(d.message));
  }
  return lines.join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // Never fail the visitor's submission because our alerting is misconfigured.
    console.error('notify: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set');
    return res.status(200).json({ ok: false, error: 'not_configured' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});

  // Honeypot: bots fill hidden fields, humans never see them.
  if (body.botcheck) return res.status(200).json({ ok: true, skipped: 'bot' });

  const data = {
    name:      clip(body.name, 80),
    business:  clip(body.business, 80),
    phone:     clip(body.phone, 40),
    email:     clip(body.email, 120),
    service:   clip(body.service, 40),
    website:   clip(body.website, 120),
    instagram: clip(body.instagram, 60),
    message:   clip(body.message, 1500)
  };

  if (!data.name && !data.email && !data.message) {
    return res.status(400).json({ ok: false, error: 'empty' });
  }

  try {
    const tg = await fetch(TELEGRAM_API + '/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(data),
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const result = await tg.json();
    if (!result.ok) console.error('notify: telegram rejected', result);
    return res.status(200).json({ ok: !!result.ok });
  } catch (err) {
    console.error('notify: telegram request failed', err);
    return res.status(200).json({ ok: false, error: 'send_failed' });
  }
}

function safeParse(text) {
  try { return JSON.parse(text); } catch (e) { return {}; }
}
