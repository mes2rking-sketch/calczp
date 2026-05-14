const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || '';
  const parts = authHeader.split(' ');
  return parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
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

    const result = await sql`
      SELECT settings_json FROM user_settings WHERE user_id = ${userId}
    `;

    if (result.rows.length === 0) {
      return res.status(200).json({ settings: null });
    }

    res.status(200).json({ settings: result.rows[0].settings_json });
  } catch (error) {
    console.error('Load settings error:', error);
    res.status(500).json({ error: 'Failed to load settings' });
  }
};
