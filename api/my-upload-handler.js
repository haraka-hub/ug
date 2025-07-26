import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { searchParams } = new URL(req.url, http://${req.headers.host});
    const filename = searchParams.get('filename');

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const blob = await put(filename, req.body, {
      access: 'public',
    });

    return res.status(200).json(blob);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
}
