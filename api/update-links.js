// Vercel Serverless Function: api/update-links.js
// Expects POST { content: '<raw links.json text>' }
// Requires header 'x-admin-secret' matching process.env.ADMIN_SECRET
// Requires process.env.GITHUB_TOKEN with repo contents permission

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  if (!process.env.GITHUB_TOKEN) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' });

  const { content } = req.body || {};
  if (!content) return res.status(400).json({ error: 'Missing content' });

  const owner = 'johnblackpipes-coder';
  const repo = 'JoziNites_Links';
  const path = 'links.json';
  const branch = 'main';

  try {
    // 1) Get current file to find SHA
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, 'User-Agent': 'JoziNites Admin' }
    });
    if (!getRes.ok) {
      const text = await getRes.text();
      return res.status(500).json({ error: 'Could not fetch current file', details: text });
    }
    const file = await getRes.json();
    const sha = file.sha;

    // 2) Update with new content (base64)
    const base64 = Buffer.from(content, 'utf8').toString('base64');
    const body = {
      message: 'Update links.json via admin UI',
      content: base64,
      sha,
      branch
    };

    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}`, 'User-Agent': 'JoziNites Admin', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const putBody = await putRes.json();
    if (!putRes.ok) return res.status(500).json({ error: 'Failed to update file', details: putBody });

    return res.status(200).json({ commit: putBody.commit && putBody.commit.sha });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
