import { getSignedBlobUrl } from "@vercel/blob";

export default async function handler(req, res) {
  const { filename, contentType } = req.query;

  // Debugging logs
  console.log("🧪 filename:", filename);
  console.log("🧪 contentType:", contentType);
  console.log("🧪 TOKEN loaded:", !!process.env.BLOB_READ_WRITE_TOKEN);

  try {
    const { url, blob } = await getSignedBlobUrl({
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType,
      filename,
    });

    console.log("✅ Blob signed URL created.");
    res.status(200).json({ url, blob });
  } catch (err) {
    console.error("❌ Signed URL error:", err);
    res.status(500).json({ error: "Failed to create signed URL" });
  }
}
