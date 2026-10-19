// Bulletin Board Studio — AI writer (optional)
// A tiny Cloudflare Worker that keeps your Anthropic API key secret and writes
// board content for the website. Setup steps are in README.md, part 2.
//
// Settings (Cloudflare → your Worker → Settings → Variables and Secrets):
//   ANTHROPIC_API_KEY  (Secret)  your key from console.anthropic.com
//   ALLOWED_ORIGIN     (Text)    your site address, e.g. https://yourname.github.io
//   MODEL              (Text, optional)  defaults to claude-sonnet-5-5

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean);
    const originOk = allowed.length > 0 && allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': originOk ? origin : (allowed[0] || ''),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return json({ error: 'use_post' }, 405, cors);
    if (!originOk) return json({ error: 'origin_not_allowed' }, 403, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'missing_key' }, 500, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'bad_request' }, 400, cors); }
    const title = String(body.title || '').slice(0, 60).trim();
    const idea = String(body.idea || '').slice(0, 500).trim();
    const grade = String(body.grade || '').slice(0, 40).trim();
    const lang = body.lang === 'ar' ? 'ar' : 'en';
    if (!title) return json({ error: 'missing_title' }, 400, cors);

    const prompt = `You are helping a school teacher design a classroom bulletin board.
Title: ${title}
Idea: ${idea || '(none given)'}
Students: ${grade || 'not specified'}
${lang === 'ar' ? 'Write every string in clear Modern Standard Arabic (الفصحى), suitable for school students. Keep the JSON keys in English.' : 'Write short, accurate, age-appropriate content in British English.'} Every string will be printed on a small card, so keep within the word limits.
Return only JSON with exactly this shape:
{"subtitle":"max 8 words","bigQuestion":"one thought-provoking question, max 14 words","facts":[{"heading":"max 3 words","text":"max 22 words"}],"vocab":[{"term":"1-2 words","def":"max 12 words"}],"flaps":[{"q":"a question students think about before lifting a flap, max 12 words","a":"the answer, max 20 words"}],"challenges":["a quick task students can do at the board, max 14 words"],"celebrate":{"heading":"max 3 words celebrating students","prompt":"max 10 words"},"voice":["a sentence starter for students' sticky notes, max 6 words, ending with …"]}
facts: exactly 4. vocab: exactly 4. flaps: exactly 3. challenges: exactly 4. voice: exactly 3.`;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: env.MODEL || 'claude-sonnet-5-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!r.ok) return json({ error: 'ai_error', status: r.status }, 502, cors);

    const data = await r.json();
    const text = (data.content || []).map(b => b.text || '').join('');
    const start = text.indexOf('{'), end = text.lastIndexOf('}');
    try {
      return json(JSON.parse(text.slice(start, end + 1)), 200, cors);
    } catch {
      return json({ error: 'bad_ai_answer' }, 502, cors);
    }
  }
};

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'content-type': 'application/json' } });
}
