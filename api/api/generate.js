// api/generate.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // 1. Generate a random key format: XXXX-XXXX-XXXX
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 12; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i === 3 || i === 7) key += '-';
  }

  try {
    // 2. Save it to the database as "unused" (0)
    await kv.set(`key:${key}`, 0);
    res.status(200).json({ success: true, key: key });
  } catch (error) {
    res.status(500).json({ error: 'Database not connected yet.' });
  }
}
