// /api/blob-upload-url.js
import { getSignedBlobUrl } from "@vercel/blob";

export default async function handler(req, res) {
  const { filename, contentType } = req.query;

  try {
    const { url, blob } = await getSignedBlobUrl({
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,  // must match env var
      contentType,
      filename,
    });

    res.status(200).json({ url, blob });
  } catch (err) {
    console.error("Signed URL error:", err);
    res.status(500).json({ error: "Failed to create signed URL" });
  }
}
