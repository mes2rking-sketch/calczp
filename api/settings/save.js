const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  return parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;
    const settings = req.body;

    if (!settings) {
      return res.status(400).json({ error: 'Settings data required' });
    }

    // Upsert settings
    const result = await sql`
      INSERT INTO user_settings (user_id, settings_json)
      VALUES (${userId}, ${JSON.stringify(settings)})
      ON CONFLICT (user_id)
      DO UPDATE SET settings_json = ${JSON.stringify(settings)}, saved_at = NOW()
      RETURNING id
    `;

    res.status(200).json({ ok: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
};
