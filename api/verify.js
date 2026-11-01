// api/verify.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { key } = req.body;
  if (!key) return res.status(400).json({ error: 'No key provided' });

  try {
    // 1. Check if the key exists in the database
    const status = await kv.get(`key:${key}`);

    // 2. If it doesn't exist, reject.
    if (status === null) {
      return res.status(401).json({ error: 'Invalid key' });
    }

    // 3. If it exists and is unused (0), mark it as used (1)
    if (status === 0) {
      await kv.set(`key:${key}`, 1); 
      return res.status(200).json({ success: true });
    }

    // 4. If it exists but is already used, reject.
    return res.status(401).json({ error: 'Key already used' });
    
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
}
