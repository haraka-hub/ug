// File: /api/my-upload-handler.js
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, contentType } = req.query;

  if (!filename || !contentType) {
    return res.status(400).json({ error: 'Missing filename or contentType' });
  }

  try {
    const { url, blob } = await put(filename, {
      access: 'public',
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ url, blob });
  } catch (err) {
    console.error('Failed to get upload URL:', err);
    return res.status(500).json({ error: 'Failed to get upload URL' });
  }
}
