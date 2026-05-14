import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const VALID_USERNAME = /^[a-zA-Z0-9]+$/;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (!VALID_USERNAME.test(username)) {
      return res.status(400).json({ error: 'Username can only contain Latin letters and digits' });
    }

    if (!VALID_USERNAME.test(password)) {
      return res.status(400).json({ error: 'Password can only contain Latin letters and digits' });
    }

    // Get user
    const result = await sql`
      SELECT id, username, password_hash FROM users WHERE username = ${username}
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}
